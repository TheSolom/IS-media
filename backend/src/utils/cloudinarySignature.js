import { v2 as Cloudinary } from 'cloudinary';

const signUploadForm = () => {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = Cloudinary.utils.api_sign_request({
        timestamp,
        folder: 'SocialMedia',
    }, process.env.CLOUDINARY_API_SECRET);

    return { timestamp, signature };
};

export default signUploadForm;
