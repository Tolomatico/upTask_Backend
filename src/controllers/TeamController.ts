import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"


export class TeamMemberController {


    static getProjectTeam= async (req: Request, res: Response) => {

        try {
            const project=await Project.findById(req.project.id).populate({
                path:"team",
                select:"_id email name"
            })
          

            res.json(project.team)
        } catch (error) {
            console.log(error)
        }
    }
    static findMemberByEmail = async (req: Request, res: Response) => {

        const { email } = req.body

        try {
            const user = await User.findOne({ email }).select("_id email name")
            if (!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({ error: error.message })
            }

            res.json(user)
        } catch (error) {
            console.log(error)
        }
    }

    static addMemberById = async (req: Request, res: Response) => {

        const { id } = req.body

        try {
            const user = await User.findById(id).select("_id")
            if (!user) {
                const error = new Error("Usuario no encontrado")
                return res.status(404).json({ error: error.message })
            }
            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                const error = new Error("El usuario ya existe en el proyecto")
                return res.status(409).json({ error: error.message })
            }

            req.project.team.push(user.id)
            await req.project.save()
            res.send("Usuario agregado correctamente")
        } catch (error) {
            console.log(error)
        }
    }

    static removeMemberById = async (req: Request, res: Response) => {

        const { userId } = req.params
        try {

            if (!req.project.team.some(team => team.toString() === userId)) {
                const error = new Error("El usuario no existe en el proyecto")
                return res.status(409).json({ error: error.message })
            }

            req.project.team = req.project.team.filter(team => team.toString() !== userId)
            await req.project.save()

            res.json("Usuario eliminado del proyecto")

        } catch (error) {
            console.log(error)
        }
    }
}
