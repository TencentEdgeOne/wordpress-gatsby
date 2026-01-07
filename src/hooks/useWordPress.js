import { useState, useEffect } from 'react'
import { 
  getSocialMediaFromCategory,
  getHeroFromCategory,
  getAboutFromCategory,
  getFooterFromCategory,
  getPostsPageMetaFromCategory,
  getCommentsPageMetaFromCategory,
  getContactFromCategory
} from '../services/wordpressApi'

// Hook to get social media data from category
export const useSocialMediaFromCategory = () => {
  const [socialMedia, setSocialMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSocialMediaFromCategory();
        setSocialMedia(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  return { socialMedia, loading, error };
};

// Hook specifically for requesting hero data
export const useHeroFromCategory = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHeroFromCategory();
        setHeroData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  return { heroData, loading, error };
};

// Hook specifically for requesting about data
export const useAboutFromCategory = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAboutFromCategory();
        setAboutData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  return { aboutData, loading, error };
};

// Hook specifically for requesting footer data
export const useFooterFromCategory = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFooterFromCategory();
        setFooterData(data.footer || data); // Compatible with footer object or wrapped in outer layer
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  return { footerData, loading, error };
};

// Hook specifically for requesting posts page title and subtitle
export const usePostsPageMetaFromCategory = () => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPostsPageMetaFromCategory();
        setMeta(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  return { meta, loading, error };
};

// Hook specifically for requesting comments page title, subtitle, and guidelines list
export const useCommentsPageMetaFromCategory = () => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCommentsPageMetaFromCategory();
        setMeta(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  return { meta, loading, error };
};

// Hook specifically for requesting contact page data
export const useContactFromCategory = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getContactFromCategory();
        setContactData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  return { contactData, loading, error };
}; 