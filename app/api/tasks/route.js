import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mockTasks } from '@/data/mockTasks'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const useMock = searchParams.get('mock') === 'true'

        if (!useMock && process.env.DATABASE_URL) {
            try {
                const tasks = await prisma.task.findMany({
                    orderBy: { created_at: 'desc' }
                })
                if (tasks && tasks.length > 0) {
                    console.log(`✅ Fetched ${tasks.length} tasks from database`)
                    return NextResponse.json(tasks)
                }
            } catch (dbError) {
                console.warn('⚠️ Prisma connection error, using mock data:', dbError.message)
            }
        }

        console.log('📦 Using mock task data')
        return NextResponse.json(mockTasks)

    } catch (error) {
        console.error('Error fetching tasks:', error)
        return NextResponse.json(mockTasks)
    }
}
