import type { Request, Response } from "express";
import Task, { ITask } from "../models/Task";


export class TaskController {

    static createTask = async (req: Request, res: Response) => {


        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            Promise.allSettled([task.save(), req.project.save()])
            res.send("Tarea creada correctamente")

        } catch (error) {
            console.log(error)
        }

    }

    static getProjectTask = async (req: Request, res: Response) => {

        const task = await Task.find({ project: req.project.id }).populate("project")
        try {
            res.json(task)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectTaskById = async (req: Request, res: Response) => {

        try {
            const task = await Task.findById(req.task.id).populate({
                path: "completedBy.user",
                select: "email name _id"
            }).populate({
                path:"notes",populate:{path:"createdBy",select:"_id email name"}
            })
            res.json(task)
        } catch (error) {
            console.log(error)
        }
    }



    static updateTask = async (req: Request, res: Response) => {


        try {

            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.json("Tarea actualizada correctamente")
        } catch (error) {
            console.log(error)
        }

    }

    static deleteTask = async (req: Request, res: Response) => {


        try {

            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send("Tarea eliminada correctamente")
        } catch (error) {
            console.log(error)
        }
    }

    static updateStatus = async (req: Request, res: Response) => {

        try {

            const { status } = req.body
            req.task.status = status

            const data  = {
                user: req.user.id,
                status:status
            }

           req.task.completedBy.push(data)
            await req.task.save()
            res.json("Estado de la tarea actualizado correctamente")
        } catch (error) {
            console.log(error)
        }

    }




}