import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    context: {params: Promise<{courseId: string, attachmentId: string}>}
) {
    try{
        const {courseId, attachmentId} = await context.params
        const {userId} = await auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status:401});
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", {status:401});
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId: courseId,
                id: attachmentId,
            }
        })

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID",error)
        return new NextResponse("internal Error", {status: 500});
    }
}