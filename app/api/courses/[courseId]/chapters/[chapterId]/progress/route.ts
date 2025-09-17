import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    context: {params: Promise<{ courseId: string; chapterId: string }>}
) {
    try {
        const {chapterId, courseId} = await context.params
        const {userId} = await auth()
        const {isCompleted} = await req.json()

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: chapterId,
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: chapterId,
                isCompleted
            }
        })

        return NextResponse.json(userProgress)
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]",error)
        return new NextResponse("Internal Error", {status: 500})
    }
}