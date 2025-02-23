import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const APIKEY = process.env.OPENAI_API;

const openai = new OpenAI({
  apiKey: APIKEY,
});

async function generatePackingList(formData) {
  const {
    destination,
    dates,
    travelPurpose,
    travellers,
    airbnb,
    hotelORhostel,
    cruiseship,
    camping,
    plane,
    car,
    ship,
    activities,
  } = formData;

  console.log(formData);

  const prompt = `
  Generate a categorized packing list for a trip. Return a JSON object formatted like this:
  {

  "trip":{
        "destination": ${destination},
        "trip_purpose": ${travelPurpose},
        "activities": ${activities.join(
          ", "
        )} make it one string, separate words where it makes sense winterSports should be "winter sports" and so on), separate activities by ,
    }

    "list": [
    {"item": "string", "category": "before you go", "link": "url"},
    {"item": "string", "category":"documents"," "link": "url"},
    {"item": "string", "category":"clothes", "quantity": number "link": "url"},
    {"item": "string", "category":"activity-items",  "quantity": number "link": "url"},
    {"item": "string", "category":"toiletries", "quantity": number, "link": "url"},
    {"item": "string", "category":"tech", "link": "url"},
    {"item": "string", "category":"health", "quantity": number, "link": "url"},
    {"item": "string", "category":"food and snacks", "quantity": number, "link": "url"},
    {"item": "string", "category":"misc", "quantity": number, "link": "url"},
    ]
    
    
  }

  Fill in all relevant fields based on the following trip details:
  - Destination: ${destination}
  - Dates: ${dates.join(" to ")}
  - Travel Purpose: ${travelPurpose}
  - Number of Travelers: ${travellers}
  - Accommodations: ${airbnb ? "Airbnb" : ""} ${
    hotelORhostel ? "Hotel/Hostel" : ""
  } ${cruiseship ? "Cruise Ship" : ""} ${camping ? "Camping" : ""}
  - Transportation: ${plane ? "Plane" : ""} ${car ? "Car" : ""} ${
    ship ? "Ship" : ""
  }
  - Activities: ${activities.join(", ")}

  ---

  ### **Important Guidelines:**  
  1. **Think like a seasoned traveler** who has been on this type of trip multiple times.  
  2. Don't forget essentials** like socks, tshirts etc, but also include more niche suggestions. 
  3. Add relevant **links** where appropriate (e.g., to get information).  
  4. For each category, include **quantities** only when necessary (e.g., item:Socks quantity:3).  
  5. **Ensure the response is only a valid JSON object** with no extra text, explanations, or formatting.  
  6. Provide **relevant links or tips** like visa information, plug type adapters, weather, and local recommendations for the specified dates.  
  7. **Be specific** in your item lists. Items should reflect the **unique** nature of the trip, such as festival-specific gear, camping essentials, etc.
  8. Don't include printed copies.
  9. Add extensive list of clothes that includes essentials like socks, underwear etc, but also include very niche items specific for the trip.


  ---

  Make the packing list as detailed and practical as possible based on the above information.`;

  try {
    // Make the API request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert travel assistant who creates highly specific, experience-based packing lists tailored to unique trips. You generate structured JSON packing lists.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let packingList = response.choices[0].message.content.trim();

    if (packingList.startsWith("```json") && packingList.endsWith("```")) {
      packingList = packingList.slice(7, -3).trim();
    }

    // Parse the cleaned string to JSON
    const jsonResponse = JSON.parse(packingList);
    // console.log(jsonResponse.trip);

    console.log(jsonResponse.trip);
    return jsonResponse;
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error.response && error.response.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    }

    throw error;
  }
}

export { generatePackingList };
