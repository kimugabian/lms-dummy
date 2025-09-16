import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!
});

export async function DELETE (
    req: Request,
    context : {params: Promise<{courseId: string; chapterId: string}>}
) {
    try {
        const {courseId, chapterId} = await context.params;
        const {userId} = await auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!ownCourse) {
            return new NextResponse("Unauthorized", {status:401})
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            }
        })

        if(!chapter) {
            return new NextResponse("Not Found", {status:404})
        }

        if(chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            })

            if(existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                })
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            }
        })

        if(!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            })
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
    context: {params: Promise<{courseId:string; chapterId: string}>}
) {
    try {
        const {courseId, chapterId} = await context.params;
        const {userId} = await auth();
        const {isPublished, ...values} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                ...values,
            }
        })

        if(values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                }
            })

            if(existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                })
            }

            const asset = await mux.video.assets.create({
                inputs: [{url: values.videoUrl}],
                playback_policy: ["public"],
                test: false,
            })

            await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            })
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[COURSES_CHAPTER_ID]", error instanceof Error ? error.message: error)
        return new NextResponse("Internal Error", {status:500});
    }
}