import express from "express"
import middleware from "../middlewares/middleware"
import { CustomMiddlewareRequest, USER_TYPES } from "../data/config"
import { Admin_GHOST } from "../data/schema"
import adminMiddleware from "../middlewares/adminMiddleWare"

const userDetailsRouter = express.Router()

userDetailsRouter.use(middleware)

userDetailsRouter.get("/", adminMiddleware, async (req: CustomMiddlewareRequest, res) => {
    try {
        const response = await Admin_GHOST.find({
            _id: req.orgId
        })
        if (req.userRole === USER_TYPES.USER) {
            return res.status(401).json({
                message: "User are not authorized to this section"
            })
        }
        const users = response[0].user
        const userDetails = users.map(({ _id, name, role }) => ({
            _id,
            name,
            role
        }));

        return res.json({
            user: userDetails
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

userDetailsRouter.put("/", adminMiddleware, async (req: CustomMiddlewareRequest, res) => {
    const body = req.body
    let { userId, role } = body
    if (userId === req.userId) {
        return res.status(401).json({
            message: "You cannot update your role"
        })
    }
    if (!Object.values(USER_TYPES).includes(role)) {
        return res.status(404).json({
            message: "User type is incorrect"
        })
    }
    try {
        const response = await Admin_GHOST.findOneAndUpdate(
            {
                _id: req.orgId,
                'user._id': userId
            },
            {
                $set: {
                    'user.$.role': role
                }
            },
            { new: true }
        )
        const users = response?.user
        const userDetails = users?.map(({ _id, name, role }) => ({
            _id,
            name,
            role
        }));
        return res.json({
            message: "User role updated successfully!",
            user: userDetails
        })
    } catch (err) {
        console.log("Error while updating user role", err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

userDetailsRouter.delete("/:userId", adminMiddleware, async (req: CustomMiddlewareRequest, res) => {
    const userId = req.params.userId
    try {
        if (userId === req.userId) {
            return res.status(401).json({
                message: "You cannot delete yourself"
            })
        }
        const response = await Admin_GHOST.findOneAndUpdate({
            _id: req.orgId
        }, {
            $pull: {
                user: {
                    _id: userId
                }
            }
        },
            { new: true }
        )
        const users = response?.user
        const userDetails = users?.map(({ _id, name, role }) => ({
            _id,
            name,
            role
        }));
        return res.json({
            message: "User deleted successfully...",
            user: userDetails

        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
})

export default userDetailsRouter;
