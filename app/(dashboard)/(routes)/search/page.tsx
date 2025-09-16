import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { Suspense } from "react";

interface SearchPageProps {
    searchParams: Promise<{
        title: string;
        categoryId: string;
    }>
}

const SearchPage = async ({
    searchParams
}: SearchPageProps) => {
   return (
    <Suspense>
    <Search 
    searchParams={searchParams}
    />
    </Suspense>
   )
}

const Search = async ({
    searchParams
}: SearchPageProps) => {
    const {userId} = await auth();

    if(!userId) {
        return redirect("/");
    }
    const resolvedParams = await searchParams;
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })


    const courses = await getCourses({
        userId,
        ...resolvedParams,
    })

    return (
        <>
        <div className="px-6 pt-6 md:hidden md:mb-0 block">
            <SearchInput />
        </div>
        <div className="p-6 space-y-4">
            <Categories
            items={categories}
            />
            <CoursesList 
            items={courses}
            />
        </div>
        </>
    );
}

 
export default SearchPage;