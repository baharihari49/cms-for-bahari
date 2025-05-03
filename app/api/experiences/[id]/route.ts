// app/api/experiences/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Definisikan interface untuk Experience
interface ExperienceData {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  isCurrent?: boolean;
  description?: string;
  list?: string | string[];
  skills?: string | string[];
  achievements?: string | string[];
  [key: string]: unknown; // Untuk properti dinamis lainnya
}

// GET experience by id
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop(); // Ambil id dari path
    if (!id) throw new Error('ID not found in URL');

    const experience = await prisma.experience.findUnique({ where: { id } });

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    const transformedExperience = {
      ...experience,
      list: JSON.parse(experience.list as string),
      skills: JSON.parse(experience.skills as string),
      achievements: JSON.parse(experience.achievements as string),
    };

    return NextResponse.json({ success: true, data: transformedExperience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}


export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) throw new Error('ID not found in URL');

    const body = await request.json();

    const dataToUpdate: ExperienceData = { ...body };
    if (body.list) dataToUpdate.list = JSON.stringify(body.list);
    if (body.skills) dataToUpdate.skills = JSON.stringify(body.skills);
    if (body.achievements) dataToUpdate.achievements = JSON.stringify(body.achievements);

    const experience = await prisma.experience.update({
      where: { id },
      data: dataToUpdate,
    });

    const transformedExperience = {
      ...experience,
      list: JSON.parse(experience.list as string),
      skills: JSON.parse(experience.skills as string),
      achievements: JSON.parse(experience.achievements as string),
    };

    return NextResponse.json({ success: true, data: transformedExperience });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) throw new Error('ID not found in URL');

    await prisma.experience.delete({ where: { id } });

    return NextResponse.json({ 
      success: true, 
      message: 'Experience deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}


// // DELETE experience
// export async function DELETE(
//   request: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = context.params;
//     await prisma.experience.delete({
//       where: { id },
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Experience deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Error deleting experience:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to delete experience' },
//       { status: 500 }
//     );
//   }
// }