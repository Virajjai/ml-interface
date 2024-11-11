// pages/api/predict.js
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { image } = req.body;

            // Forward the request to the FastAPI model server
            const response = await axios.post('http://localhost:5000/predict', { image });

            // Send the prediction result back to the client
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error making prediction:', error);
            res.status(500).json({ error: 'Prediction request failed' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
