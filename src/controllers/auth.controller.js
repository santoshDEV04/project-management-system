import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import {sendEmail, emailVerificationMailgenContent } from "../utils/mail.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false
        })

        return { accessToken , refreshToken }
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access Token",
        )
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {email , userName, password } = req.body


    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or password already exits", [])
    }

    const user = await User.create({
        email,
        userName,
        password,
        isEmailVerified: false
    })


    const { unHashedToken , hashedToken , tokenExpiry } = user.generateTemporaryToken()


    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({ validateBeforeSave: false })


    await sendEmail(
        {
            email: user?.email,
            subject: "Please verify your email",
            mailgenContent: emailVerificationMailgenContent(
                user.userName,
                `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
            )
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificaitonToken -emailVerificationExpiry")

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(200, {user: createdUser},
        "User registerd successfully and verification email has been sent on your email."
    ))
})


const login = asyncHandler(async (req, res) => {
    const { email , userName , password } = req.body
    if(!userName && !email) {
        throw new ApiError(400 , "userName or email is required!")
    }

    const user = await User.findOne({ $or : [{ userName } , { email }]})

    if(!user) {
        throw new ApiError(400, "User does not exists !")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials..!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

const loggedUser = await User.findById(user._id).select("-password -refreshToken -emailVerificaitonToken -emailVerificationExpiry")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    );

    const options = { httpOnly : true , secure : true }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged Out."
            )
        )
})

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"));
})

const verifyEmail = asyncHandler (async (req, res) => {
    const {verificationToken} = req.params

    if(!verificationToken) {
        throw new ApiError(400, "Email Verification token is missing")
    }

    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

        await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: {$gt: Date.now()}
        })

        if(!user){
            throw new ApiError(400, "Token is invalid or expired")
        }

        user.emailVerificationToken = undefined
        user.emailVerificationExpiry = undefined

        user.isEmailVerified = true
        await user.save({validateBeforeSave: false})


        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {
                    isEmailVerified: true
                },
                "email is verified"
            ))

})

const resendEmailVerificaiton = asyncHandler( async(req, res) => {
    const user = await User.findById(req.user?._id)

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    if(user.isEmailVerified){
        throw new ApiError(409, "Email is already verified")
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false })

    await sendEmail ({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
        )
    });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "mail has been sent to your email ID"
        ))
})

const refreshAccessToken = asyncHandler (async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access")
    }


    try {

    } catch (error) {

    }


})


export { registerUser, login, logoutUser, getCurrentUser, verifyEmail, resendEmailVerificaiton}