"use client";
import React, { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Utensils,
  Sparkles,
  ShoppingBag,
  Heart,
  ShieldCheck,
  ExternalLink,
  ChefHat,
  Clock,
  Flame,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

const CURATED_RECIPES = [
  {
    id: 1,
    title: "Eczema-Friendly Anti-Inflammatory Salmon Bowl",
    condition: "ECZEMA",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    prepTime: "15m",
    calories: "480 kcal",
    desc: "Rich in Omega-3 fats, quercetin & curcumin. Free of nightshades and common eczema triggers.",
    ingredients: ["Wild Alaskan Salmon", "Baby Spinach", "Extra Virgin Olive Oil", "Turmeric Quinoa"],
    shopUrl: "https://www.instacart.com/store/s?k=wild+salmon",
  },
  {
    id: 2,
    title: "Low-Glycemic Mediterranean Avocado Chicken",
    condition: "DIABETES",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    prepTime: "20m",
    calories: "420 kcal",
    desc: "Zero refined sugars, high in monounsaturated fats and soluble fiber to stabilize blood glucose.",
    ingredients: ["Grilled Chicken Breast", "Hass Avocado", "Cherry Tomatoes", "Cucumber", "Feta"],
    shopUrl: "https://www.instacart.com/store/s?k=avocado",
  },
  {
    id: 3,
    title: "DASH-Compliant Garlic Herb Baked Cod",
    condition: "CARDIAC / BP",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    prepTime: "18m",
    calories: "390 kcal",
    desc: "Ultra-low sodium (< 140mg), high potassium & magnesium to promote arterial vasodilation.",
    ingredients: ["Wild Cod Filet", "Steamed Asparagus", "Herbes de Provence", "Lemon Zest"],
    shopUrl: "https://www.instacart.com/store/s?k=cod+filet",
  },
];

export default function RecipeStudioPage() {
  const [selectedCondition, setSelectedCondition] = useState("eczema");
  const [pantryIngredients, setPantryIngredients] = useState("Salmon, Spinach, Olive Oil, Turmeric");
  const [restrictions, setRestrictions] = useState("Gluten-Free, Dairy-Free");
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const generateRecipe = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/recipe-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: selectedCondition,
          ingredients: pantryIngredients,
          restrictions,
        }),
      });
      const data = await res.json();
      setGeneratedRecipe(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout activeTab="recipe-studio">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Utensils className="text-emerald-400" size={24} />
              ADK Recipe Studio & Personalized Nutritional Guidance
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Condition-specific curated recipes & real-time AI recipe generation with direct marketplace shopping sync.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center gap-1.5">
              <ShieldCheck size={14} /> Eczema & Chronic Care Validated
            </span>
          </div>
        </div>

        {/* AI Recipe Generator Section */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <ChefHat className="text-amber-400" size={22} />
            <h3 className="text-xl font-bold text-white">AI Custom Recipe Generator</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Target Chronic Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="eczema">Eczema (Anti-Inflammatory)</option>
                <option value="diabetes">Diabetes (Low-Glycemic)</option>
                <option value="hypertension">Hypertension (DASH Low-Sodium)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Pantry Ingredients On-Hand</label>
              <input
                type="text"
                value={pantryIngredients}
                onChange={(e) => setPantryIngredients(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g. Salmon, Spinach, Quinoa"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase">Dietary Restrictions</label>
              <input
                type="text"
                value={restrictions}
                onChange={(e) => setRestrictions(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g. Gluten-Free, Dairy-Free"
              />
            </div>
          </div>

          <button
            onClick={generateRecipe}
            disabled={generating}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {generating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {generating ? "Crafting Recipe..." : "Generate Custom AI Recipe"}
          </button>

          {/* Generated Recipe Card */}
          {generatedRecipe && (
            <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h4 className="text-lg font-bold text-white">{generatedRecipe.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><Clock size={14} className="text-blue-400" /> Prep: {generatedRecipe.prepTime}</span>
                  <span className="flex items-center gap-1"><Flame size={14} className="text-amber-400" /> {generatedRecipe.macros.calories} kcal</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase">Key Clinical Benefits</div>
                <div className="space-y-1">
                  {generatedRecipe.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase">Ingredients & Marketplace Sync</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {generatedRecipe.ingredientsList.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg border border-slate-800 text-xs">
                      <span className="text-slate-200 font-medium">{ing.name} ({ing.qty})</span>
                      <a
                        href={ing.marketplaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        <ShoppingBag size={13} /> Order
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Curated Recipe Library */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart size={20} className="text-red-400" /> Curated Care Journey Recipes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CURATED_RECIPES.map((recipe) => (
              <div key={recipe.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${recipe.badgeColor}`}>
                      {recipe.condition}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{recipe.calories}</span>
                  </div>
                  <h4 className="font-bold text-white">{recipe.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{recipe.desc}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <a
                    href={recipe.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold py-2 px-4 rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <ShoppingBag size={14} /> Sync Ingredients to Cart <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
