import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
    // Upload image to Supabase
    if (req.method === 'POST') {
        let { image } = req.body;

        if (!image) {
            return res.status(500).json({ message: 'No image provided' });
        }

        const contentType = image.match(/data:(.*);base64/)?.[1];
        const base64FileData = image.split('base64,')?.[1];

        if (!contentType || !base64FileData) {
            return res.status(500).json({ message: 'Image data not valid' });
        }

        const fileName = nanoid();
        const ext = contentType.split('/')[1];
        const path = `${fileName}.${ext}`;

        const { data, error: uploadError } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(`public/${path}`, decode(base64FileData), {
                contentType,
                upsert: true,
            });

        if (uploadError) {
            console.log(uploadError,"<<<<<<<<< ERROR UPLOAD")
            throw new Error('Unable to upload image to storage');
        }

        console.log(data)

        const url = `${process.env.SUPABASE_URL.replace('.in', '.co')}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${data.path}`;

        return res.status(200).json({ url });
    }
    // HTTP method not supported!
    else {
        res.setHeader('Allow', ['POST']);
        res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported.` });
    }
}