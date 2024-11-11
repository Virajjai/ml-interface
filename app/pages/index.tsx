// pages/index.tsx
import { useState, ChangeEvent } from 'react';

// Define types for prediction response from API
interface PredictionResponse {
    predicted_class: number;
}

export default function Home() {
    const [prediction, setPrediction] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Function to handle image upload and process prediction
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.onload = async () => {
            canvas.width = 28;
            canvas.height = 28;
            ctx.drawImage(img, 0, 0, 28, 28);

            const imageData = ctx.getImageData(0, 0, 28, 28);
            const grayscaleImage = Array.from(imageData.data)
                .filter((_, i) => i % 4 === 0);

            setLoading(true);
            try {
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: grayscaleImage }),
                });

                if (!response.ok) {
                    throw new Error('Prediction request failed');
                }

                const result: PredictionResponse = await response.json();
                setPrediction(result.predicted_class);
            } catch (error) {
                console.error('Error predicting:', error);
                setPrediction(null);
            } finally {
                setLoading(false);
            }
        };

        img.src = URL.createObjectURL(file);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>EMNIST Character Prediction</h1>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {loading ? (
                <p>Predicting...</p>
            ) : (
                prediction !== null && <p>Predicted Class: {prediction}</p>
            )}
        </div>
    );
}
