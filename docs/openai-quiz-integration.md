# OpenAI Quiz Integration - Usage Guide

## Overview

The Digital Village website now includes AI-powered quiz question generation using OpenAI's GPT-4o-mini model. This allows for dynamic, contextual NIRD quiz questions.

## API Endpoint

**POST** `/api/quiz/generate`

### Request Body

```json
{
  "topic": "Linux et logiciels libres",
  "difficulty": "medium",
  "count": 5
}
```

### Parameters

- `topic` (string, required): The specific NIRD topic for questions
- `difficulty` (string, optional): "easy", "medium", or "hard" (default: "medium")
- `count` (number, optional): Number of questions to generate (default: 5)

### Response

```json
{
  "questions": [
    {
      "question": "Pourquoi Linux est-il idéal pour NIRD?",
      "options": [
        "Il est gratuit",
        "Il fonctionne sur vieux matériel",
        "Il est open-source",
        "Toutes les réponses ci-dessus"
      ],
      "correctAnswer": 3,
      "explanation": "Linux combine tous ces avantages: gratuit, léger pour vieux matériel, et open-source pour la transparence."
    }
  ]
}
```

## Environment Setup

The API key is stored in `.env.local`:

```
OPENAI_API_KEY=your_api_key_here
```

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

## Example Usage

### From Client Component

```typescript
const generateQuestions = async () => {
  const response = await fetch('/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Sécurité et données',
      difficulty: 'hard',
      count: 10
    })
  })
  
  const data = await response.json()
  return data.questions
}
```

## NIRD Topics

The AI is trained to generate questions on these NIRD themes:

1. **Numérique Inclusif**: Equal access to technology
2. **Responsabilité**: Data protection, security, transparent governance
3. **Durabilité**: Digital sobriety, hardware reuse, free software (Linux)

## Features

- **Context-aware**: Questions are tailored to NIRD methodology
- **Difficulty levels**: Easy, medium, and hard questions
- **Educational**: Each question includes a detailed explanation
- **French language**: All questions generated in French
- **Multiple choice**: 4 options per question with one correct answer

## Error Handling

The API includes error handling for:
- Missing API key
- OpenAI API failures
- Invalid JSON responses
- Network errors

## Cost Optimization

- Uses `gpt-4o-mini` for cost efficiency
- Temperature set to 0.8 for creative but consistent questions
- Max tokens limited to 2000 to control costs

## Testing

Test the API using curl:

```bash
curl -X POST http://localhost:3000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Linux","difficulty":"easy","count":3}'
```

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Test the API endpoint
4. Integrate into quiz components
