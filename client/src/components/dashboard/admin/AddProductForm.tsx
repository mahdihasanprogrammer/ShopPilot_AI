"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types";
import {
  FiPackage,
  FiAlignLeft,
  FiFileText,
  FiDollarSign,
  FiGrid,
  FiImage,
  FiLoader,
  FiTag,
  FiArchive,
} from "react-icons/fi";
import { CATEGORIES } from "@/lib/categories";
import { toast } from "sonner";

interface FormField {
  label: string;
  name: keyof FormState;
  type: "text" | "number" | "textarea" | "select" | "url";
  placeholder: string;
  required: boolean;
  rows?: number;
  icon: React.ComponentType<{ className?: string }>;
}

interface FormState {
  title: string;
  brand: string;
  stock: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  category: string;
  imageUrl: string;
}

const INITIAL_STATE: FormState = {
  title: "",
  brand: "",
  stock: "10",
  shortDescription: "",
  fullDescription: "",
  price: "",
  category: "",
  imageUrl: "",
};

const FIELDS: FormField[] = [
  {
    label: "Product Title",
    name: "title",
    type: "text",
    placeholder: "e.g. Premium Wireless Noise-Cancelling Headphones",
    required: true,
    icon: FiPackage,
  },
  {
    label: "Brand",
    name: "brand",
    type: "text",
    placeholder: "e.g. Sony, Apple, Samsung",
    required: true,
    icon: FiTag,
  },
  {
    label: "Stock Level",
    name: "stock",
    type: "number",
    placeholder: "e.g. 10",
    required: true,
    icon: FiArchive,
  },
  {
    label: "Short Description",
    name: "shortDescription",
    type: "text",
    placeholder: "One-line summary shown in the product card (max 120 chars)",
    required: true,
    icon: FiAlignLeft,
  },
  {
    label: "Full Description",
    name: "fullDescription",
    type: "textarea",
    placeholder: "Detailed product description with features, benefits, and specifications…",
    required: true,
    rows: 5,
    icon: FiFileText,
  },
  {
    label: "Price (USD)",
    name: "price",
    type: "number",
    placeholder: "0.00",
    required: true,
    icon: FiDollarSign,
  },
  {
    label: "Category",
    name: "category",
    type: "select",
    placeholder: "Select a category",
    required: true,
    icon: FiGrid,
  },
  {
    label: "Image URL (optional)",
    name: "imageUrl",
    type: "url",
    placeholder: "https://example.com/product-image.jpg",
    required: false,
    icon: FiImage,
  },
];

export default function AddProductForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);

  // ---- Validation ----
  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};

    if (!form.title.trim()) newErrors.title = "Product title is required.";
    else if (form.title.trim().length < 5)
      newErrors.title = "Title must be at least 5 characters.";

    if (!form.brand.trim()) newErrors.brand = "Brand is required.";

    if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      newErrors.stock = "Stock must be a non-negative number.";

    if (!form.shortDescription.trim())
      newErrors.shortDescription = "Short description is required.";
    else if (form.shortDescription.trim().length > 160)
      newErrors.shortDescription = "Short description must not exceed 160 characters.";

    if (!form.fullDescription.trim())
      newErrors.fullDescription = "Full description is required.";
    else if (form.fullDescription.trim().length < 20)
      newErrors.fullDescription = "Full description must be at least 20 characters.";

    if (!form.price) newErrors.price = "Price is required.";
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = "Enter a valid price greater than 0.";

    if (!form.category) newErrors.category = "Please select a category.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the form validation errors.");
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      stock: parseInt(form.stock) || 0,
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      price: parseFloat(form.price),
      category: form.category,
      images: form.imageUrl ? [form.imageUrl.trim()] : [],
    };

    const res = await api.post<Product>("/products", payload);

    if (res.success) {
      toast.success("Product created successfully!");
      setTimeout(() => router.push("/dashboard/admin/manage-products"), 1500);
    } else {
      toast.error(res.error || "Failed to create product.");
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm font-medium text-text-neutral placeholder:text-text-neutral/30 focus:outline-none focus:ring-2 transition-all";
  const inputNormal = `${inputBase} border-bg-secondary focus:border-primary focus:ring-primary/20`;
  const inputError = `${inputBase} border-red-300 focus:border-red-400 focus:ring-red-200`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Form fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const Icon = field.icon;
          const err = errors[field.name];
          const cls = err ? inputError : inputNormal;

          return (
            <div
              key={field.name}
              className={field.name === "fullDescription" || field.name === "imageUrl" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={field.name}
                className="block text-xs font-bold uppercase tracking-wider text-text-neutral/60 mb-2"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-400 ml-1" aria-hidden>*</span>
                )}
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-neutral/30">
                  <Icon className="h-4 w-4" />
                </span>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={field.rows || 4}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    aria-describedby={err ? `${field.name}-error` : undefined}
                    className={`${cls} pl-10 resize-none leading-relaxed`}
                    style={{ paddingTop: "0.875rem" }}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    value={form[field.name]}
                    onChange={handleChange}
                    aria-describedby={err ? `${field.name}-error` : undefined}
                    className={`${cls} pl-10 cursor-pointer appearance-none`}
                  >
                    <option value="">{field.placeholder}</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    step={field.type === "number" && field.name === "price" ? "0.01" : undefined}
                    min="0"
                    aria-describedby={err ? `${field.name}-error` : undefined}
                    className={`${cls} pl-10`}
                  />
                )}
              </div>

              {err && (
                <p
                  id={`${field.name}-error`}
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-500"
                >
                  <span className="text-xs">⚠️</span>
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2 border-t border-bg-secondary">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <FiLoader className="h-4 w-4 animate-spin" />
              Publishing…
            </>
          ) : (
            "Publish Product"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/manage-products")}
          className="rounded-xl border border-bg-secondary bg-background px-6 py-3 text-sm font-semibold text-text-neutral hover:bg-bg-secondary transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
