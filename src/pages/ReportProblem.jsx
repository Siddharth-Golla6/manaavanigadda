import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, X } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { Label, Input, Select, Textarea } from "../components/FormField";
import MapPicker from "../components/MapPicker";
import { MANDALS, getVillagesForMandal } from "../data/geography";
import { CATEGORY_OPTIONS } from "../data/mockData";
import { categoryImage } from "../utils/placeholderImage";
import { compressImage } from "../utils/compressImage";
import { useProblems } from "../context/ProblemsContext";

const emptyForm = {
  title: "",
  category: "",
  mandalId: "",
  village: "",
  description: "",
};

export default function ReportProblem() {
  const { addProblem } = useProblems();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [location, setLocation] = useState(null);
  const [photoDataUrls, setPhotoDataUrls] = useState([]);
  const [error, setError] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  const MAX_PHOTOS = 10;
  const villages = form.mandalId ? getVillagesForMandal(form.mandalId) : [];

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handlePhoto = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    const remaining = MAX_PHOTOS - photoDataUrls.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    for (const file of files.slice(0, remaining)) {
      try {
        const dataUrl = await compressImage(file);
        setPhotoDataUrls((prev) => [...prev, dataUrl]);
      } catch {
        setError("One of the selected photos couldn't be read. Try a different file.");
      }
    }
  };

  const removePhoto = (index) => {
    setPhotoDataUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.category || !form.mandalId || !form.description.trim()) {
      setError("Please fill in Title, Category, Mandal and Description.");
      return;
    }

    const mandal = MANDALS.find((m) => m.id === form.mandalId);

    try {
      const photos = photoDataUrls.length
        ? photoDataUrls
        : [categoryImage(form.category, form.village || mandal.name)];

      const created = await addProblem({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        photo: photos[0],
        photos,
        mandalId: form.mandalId,
        mandalName: mandal.name,
        village: form.village || "Not specified",
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
      });
      setSubmittedId(created.id);
    } catch (err) {
      setError(err.message);
    }
  };

  if (submittedId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 size={56} className="mb-4 text-emerald-500" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Problem Reported</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Thank you. Your report has been submitted with status <strong>New</strong> and will be
          verified by the Mandal Admin. Priority is assigned by the admin team.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate(`/problem/${submittedId}`)}
            className="rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark"
          >
            View Report
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">Report a Problem</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Priority is assessed and set by the Mandal Admin after review — you don't need to set it.
      </p>

      <GlassCard as="form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title" required>Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Pothole near bus stand"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category" required>Category</Label>
            <Select id="category" value={form.category} onChange={(e) => set("category", e.target.value)} required>
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="constituency">Constituency</Label>
            <Input id="constituency" value="Avanigadda Constituency" readOnly disabled />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="mandal" required>Mandal</Label>
            <Select
              id="mandal"
              value={form.mandalId}
              onChange={(e) => setForm((f) => ({ ...f, mandalId: e.target.value, village: "" }))}
              required
            >
              <option value="">Select Mandal</option>
              {MANDALS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="village">Village (optional)</Label>
            <Select id="village" value={form.village} onChange={(e) => set("village", e.target.value)} disabled={!form.mandalId}>
              <option value="">Select village</option>
              {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" required>Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the problem in detail…"
            required
          />
        </div>

        <div>
          <Label htmlFor="photo">Photo Upload</Label>

          {photoDataUrls.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photoDataUrls.map((url, i) => (
                <div key={i} className="group relative h-24 overflow-hidden rounded-lg">
                  <img src={url} alt={`Selected ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {photoDataUrls.length < MAX_PHOTOS && (
            <label
              htmlFor="photo"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white/60 p-6 text-center transition hover:border-brand-red dark:border-neutral-700 dark:bg-neutral-900/40"
            >
              <UploadCloud size={28} className="mb-2 text-neutral-400" />
              <span className="text-sm text-neutral-500">
                {photoDataUrls.length > 0
                  ? `Add more photos (${photoDataUrls.length}/${MAX_PHOTOS})`
                  : "Click to upload photos"}
              </span>
            </label>
          )}
          <input
            id="photo"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhoto}
            className="hidden"
          />
        </div>

        <div>
          <Label>GPS Location</Label>
          <MapPicker value={location} onChange={setLocation} />
        </div>

        {error && <p className="text-sm font-medium text-brand-red" role="alert">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-red py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red-dark"
        >
          Submit Report
        </button>
      </GlassCard>
    </div>
  );
}
