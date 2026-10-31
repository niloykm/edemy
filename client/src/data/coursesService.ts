import { Course, SEED_COURSES, SEED_LIVE_CLASSES, SEED_WORKSHOPS, ALL_COURSES, getCourseByIdOrSlug } from './coursesData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://lms-backend-chi-orcin.vercel.app/api';

/**
 * Fetch courses server-side with an aggressive timeout (2.2s).
 * If the remote API fails, times out, or returns 0 courses,
 * seamlessly return our high-resolution fallback dataset.
 */
export async function getCoursesServerSide(type?: 'video' | 'online' | 'offline' | 'all'): Promise<Course[]> {
  const fallback = type === 'online'
    ? SEED_LIVE_CLASSES
    : type === 'offline'
    ? SEED_WORKSHOPS
    : type === 'all'
    ? ALL_COURSES
    : SEED_COURSES;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);

    const query = type && type !== 'all' ? `?type=${type}` : '';
    const res = await fetch(`${API_BASE}/courses${query}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Map backend courses to ensure compatibility with our schema
        const mappedBackend: Course[] = data.map((item: any) => ({
          ...item,
          id: String(item._id || item.id),
          _id: String(item._id || item.id),
          slug: item.slug || String(item._id || item.id),
          title: item.courseTitle || item.title || 'Untitled Course',
          courseTitle: item.courseTitle || item.title || 'Untitled Course',
          subtitle: item.courseDescription || item.subtitle || '',
          courseDescription: item.courseDescription || item.subtitle || '',
          category: item.category || 'Web Development',
          level: item.level || 'All Levels',
          price: Number(item.coursePrice ?? item.price ?? 99),
          coursePrice: Number(item.coursePrice ?? item.price ?? 99),
          originalPrice: Number(item.originalPrice ?? (item.coursePrice ? item.coursePrice * 1.5 : 149)),
          discount: Number(item.discount || 0),
          rating: Number(item.rating || 4.8),
          ratings: Array.isArray(item.ratings) ? item.ratings : [{ rating: 5 }],
          reviewsCount: Number(item.reviewsCount || 120),
          duration: item.duration || '18h 30m',
          durationMinutes: Number(item.durationMinutes || 1110),
          lessonsCount: Number(item.lessons?.length || item.lessonsCount || 12),
          thumbnailUrl: item.courseThumbnail || item.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          courseThumbnail: item.courseThumbnail || item.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          previewVideoUrl: item.previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          instructor: item.instructor || {
            name: item.tutorNames || 'Ndemy Instructor',
            role: item.institutionName || 'Lead Specialist',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
            bio: 'Senior software practitioner and course creator.'
          },
          tutorNames: item.tutorNames || item.instructor?.name || 'Ndemy Instructor',
          institutionName: item.institutionName || 'Ndemy Platform',
          curriculum: item.curriculum || [
            {
              id: 'mod-1',
              title: 'Module 1: Getting Started',
              lessons: item.lessons || []
            }
          ],
          lessons: item.lessons || [],
          enrolledStudents: item.enrolledStudents || [],
          type: item.type || (type && type !== 'all' ? type : 'video'),
          createdAt: item.createdAt || new Date().toISOString()
        }));

        // Merge backend items with fallback so visitor always gets rich production catalog
        return mappedBackend.length >= fallback.length ? mappedBackend : [...mappedBackend, ...fallback.slice(mappedBackend.length)];
      }
    }
  } catch (err) {
    // Graceful fallback on network timeout or serverless cold-start failure
    console.warn('API unavailable or timed out; falling back to production dataset:', err instanceof Error ? err.message : err);
  }

  return fallback;
}

/**
 * Fetch a single course by id or slug with fallback
 */
export async function getCourseByIdOrSlugServerSide(idOrSlug: string): Promise<Course | null> {
  if (!idOrSlug) return null;

  // 1. Direct match in local seed
  const localMatch = getCourseByIdOrSlug(idOrSlug);
  if (localMatch) {
    return localMatch;
  }

  // 2. Try remote API if not in seed
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE}/courses/${idOrSlug}`, {
      signal: controller.signal,
      next: { revalidate: 60 }
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const item = await res.json();
      if (item) {
        return {
          ...item,
          id: String(item._id || item.id),
          _id: String(item._id || item.id),
          slug: item.slug || String(item._id || item.id),
          title: item.courseTitle || item.title || 'Untitled Course',
          courseTitle: item.courseTitle || item.title || 'Untitled Course',
          subtitle: item.courseDescription || item.subtitle || '',
          courseDescription: item.courseDescription || item.subtitle || '',
          category: item.category || 'Web Development',
          level: item.level || 'All Levels',
          price: Number(item.coursePrice ?? item.price ?? 99),
          coursePrice: Number(item.coursePrice ?? item.price ?? 99),
          originalPrice: Number(item.originalPrice ?? 149),
          discount: Number(item.discount || 0),
          rating: Number(item.rating || 4.8),
          ratings: Array.isArray(item.ratings) ? item.ratings : [{ rating: 5 }],
          reviewsCount: Number(item.reviewsCount || 120),
          duration: item.duration || '18h 30m',
          durationMinutes: Number(item.durationMinutes || 1110),
          lessonsCount: Number(item.lessons?.length || 12),
          thumbnailUrl: item.courseThumbnail || item.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          courseThumbnail: item.courseThumbnail || item.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
          previewVideoUrl: item.previewVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          instructor: item.instructor || {
            name: item.tutorNames || 'Ndemy Instructor',
            role: item.institutionName || 'Lead Specialist',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
            bio: 'Senior software practitioner and course creator.'
          },
          tutorNames: item.tutorNames || item.instructor?.name || 'Ndemy Instructor',
          institutionName: item.institutionName || 'Ndemy Platform',
          curriculum: item.curriculum || [
            {
              id: 'mod-1',
              title: 'Module 1: Getting Started',
              lessons: item.lessons || []
            }
          ],
          lessons: item.lessons || [],
          enrolledStudents: item.enrolledStudents || [],
          type: item.type || 'video',
          createdAt: item.createdAt || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch course ${idOrSlug} from API:`, err instanceof Error ? err.message : err);
  }

  // 3. Fallback to first course if totally unknown or offline
  return SEED_COURSES[0];
}
