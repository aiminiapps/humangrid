import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { mockTasks, getRandomTasks } from '@/data/mockTasks'

/**
 * GET /api/tasks
 * Fetch all available tasks (with fallback to mock data)
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const useMock = searchParams.get('mock') === 'true'

        // Try to fetch from Supabase first
        if (!useMock) {
            const { data: tasks, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && tasks && tasks.length > 0) {
                console.log(`✅ Fetched ${tasks.length} tasks from Supabase`)
                return NextResponse.json(tasks)
            }

            console.warn('⚠️ No tasks in Supabase, using mock data:', error?.message)
        }

        // Fallback to mock data
        console.log('📦 Using mock task data')
        return NextResponse.json(mockTasks)

    } catch (error) {
        console.error('Error fetching tasks:', error)

        // Return mock data on error
        return NextResponse.json(mockTasks)
    }
}
