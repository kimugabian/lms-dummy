import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ur } from "zod/v4/locales";

export async function POST(
    req: Request,
    context : {params: Promise<{courseId: string}>}
) {
    try{
        const {courseId} = await context.params
        const {userId} = await auth();
        const {url} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status:401});
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        })

        if(!courseOwner) {
            return new NextResponse("Unauthorized", {status:401})
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: courseId
            }
        })

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error);
        return new NextResponse("Internal Error", {status:500});
    }
}