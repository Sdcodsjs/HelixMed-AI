export async function POST(request) {
  try {
    const { condition = "eczema", ingredients = "salmon, spinach, olive oil, turmeric", restrictions = "gluten-free, dairy-free" } = await request.json();

    const recipeData = {
      title: condition === "eczema" 
        ? "Anti-Inflammatory Wild Salmon & Turmeric Quinoa Bowl"
        : condition === "diabetes"
        ? "Low-Glycemic Avocado & Roasted Mediterranean Chicken Salad"
        : "Heart-Healthy Garlic Herb Baked Salmon & Kale",
      prepTime: "15 mins",
      cookTime: "20 mins",
      conditionTarget: condition.toUpperCase(),
      benefits: [
        "Rich in Omega-3 fatty acids to reduce systemic skin & vascular inflammation",
        "Zero refined sugars or high-glycemic carbohydrates",
        "Packed with bioavailable antioxidants (curcumin, polyphenols)",
      ],
      ingredientsList: [
        { name: "Wild Alaskan Salmon Filet", qty: "200g", marketplaceUrl: "https://www.instacart.com/store/s?k=wild+salmon" },
        { name: "Organic Baby Spinach", qty: "2 cups", marketplaceUrl: "https://www.instacart.com/store/s?k=organic+spinach" },
        { name: "Extra Virgin Olive Oil", qty: "2 tbsp", marketplaceUrl: "https://www.instacart.com/store/s?k=extra+virgin+olive+oil" },
        { name: "Organic Ground Turmeric", qty: "1 tsp", marketplaceUrl: "https://www.instacart.com/store/s?k=turmeric" },
        { name: "Cooked Tricolor Quinoa", qty: "1/2 cup", marketplaceUrl: "https://www.instacart.com/store/s?k=quinoa" }
      ],
      instructions: [
        "Preheat oven to 375°F (190°C). Season salmon with olive oil, turmeric, sea salt, and black pepper.",
        "Bake salmon for 12–15 minutes until tender and flaky.",
        "Toss spinach and warm quinoa with remaining olive oil and lemon juice.",
        "Plate salmon over the warm greens and serve immediately."
      ],
      macros: { calories: 480, protein: "38g", carbs: "22g", fat: "24g", fiber: "6g" }
    };

    return new Response(JSON.stringify(recipeData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to generate AI recipe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
