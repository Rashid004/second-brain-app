// Utility functions for handling embedded content

export interface EmbedInfo {
  type: "youtube" | "twitter" | "iframe" | "image" | "link";
  embedUrl?: string;
  thumbnail?: string;
  title?: string;
}

export const getYouTubeVideoId = (url: string): string | null => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const getTwitterEmbedUrl = (url: string): string => {
  return url;
};

export const extractUrlFromHtml = (html: string): string | null => {
  const youtubeMatch = html.match(
    /src=["']([^"']*youtube\.com\/embed\/[^"']*)["']/i,
  );
  if (youtubeMatch) {
    return youtubeMatch[1];
  }

  const twitterMatch = html.match(
    /href=["']([^"']*(?:twitter\.com|x\.com)[^"']*)["']/i,
  );
  if (twitterMatch) {
    return twitterMatch[1];
  }

  // Extract any other URL
  const urlMatch = html.match(/(?:src|href)=["']([^"']*)["']/i);
  if (urlMatch) {
    return urlMatch[1];
  }

  return null;
};

export const detectEmbedType = (input: string): EmbedInfo => {
  // Check if input is HTML/iframe code
  if (input.includes("<iframe") || input.includes("<blockquote")) {
    // Extract URL from HTML
    const extractedUrl = extractUrlFromHtml(input);

    if (input.includes("youtube.com/embed") || input.includes("youtu.be")) {
      const videoIdMatch = input.match(/\/embed\/([^?&"']*)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (videoId) {
        return {
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          thumbnail: getYouTubeThumbnail(videoId),
        };
      }
    }

    if (
      input.includes("twitter-tweet") ||
      input.includes("twitter.com") ||
      input.includes("x.com")
    ) {
      return {
        type: "twitter",
        embedUrl: extractedUrl || input,
      };
    }

    return {
      type: "iframe",
      embedUrl: extractedUrl || input,
    };
  }

  // Regular URL handling
  try {
    const urlObj = new URL(input);
    const hostname = urlObj.hostname.toLowerCase();

    // YouTube detection
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      const videoId = getYouTubeVideoId(input);
      if (videoId) {
        return {
          type: "youtube",
          embedUrl: getYouTubeEmbedUrl(videoId),
          thumbnail: getYouTubeThumbnail(videoId),
        };
      }
    }

    // Twitter detection
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      return {
        type: "twitter",
        embedUrl: input,
      };
    }

    // Image detection
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const pathname = urlObj.pathname.toLowerCase();
    if (imageExtensions.some((ext) => pathname.endsWith(ext))) {
      return {
        type: "image",
        embedUrl: input,
      };
    }

    return {
      type: "link",
      embedUrl: input,
    };
  } catch {
    return {
      type: "link",
      embedUrl: input,
    };
  }
};

export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};
