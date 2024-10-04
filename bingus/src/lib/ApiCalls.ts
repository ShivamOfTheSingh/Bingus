import { UserProfile, Post, Media } from "./models";

export async function getProfilePageData(userId: number) {
    const resProfile = await fetch(`http://localhost:3000/api/user_profile/${userId}`);
    const jsonProfile = await resProfile.json();
    const profile: UserProfile = {
      userId: jsonProfile[0].user_id,
      username: jsonProfile[0].user_name,
      email: jsonProfile[0].email,
      firstName: jsonProfile[0].first_name,
      lastName: jsonProfile[0].last_name,
      gender: jsonProfile[0].gender,
      birthDate: jsonProfile[0].birth_date,
      about: jsonProfile[0].about,
      profilePicture: jsonProfile[0].profile_pic
    }
    
    const resPosts = await fetch(`http://localhost:3000/api/user_profile/posts/${userId}`);
    const jsonPosts = await resPosts.json();
    const posts: Post[] = jsonPosts.map((p: any) => {
      return {
        postId: p.post_id,
        userId: p.user_id,
        caption: p.caption,
        datePosted: p.date_posted
      }
    });

    const postsWithMedia: { post: Post, media: Media[] }[] = [];
    for (let i = 0; i < posts.length; i++) {
      const resMedia = await fetch(`http://localhost:3000/api/posts/media/${posts[i].postId}`);
      const jsonMedia = await resMedia.json();
      const media: Media[] = jsonMedia.map((m: any) => {
        return {
          mediaId: m.media_id,
          postId: m.post_id,
          mediaUrl: m.media_url
        }
      });
      postsWithMedia.push({
        post: posts[i],
        media: media
      });
    }

    return {
      profile: profile,
      numPosts: posts.length,
      posts: postsWithMedia
    };
}