const fs = require("fs");
const file = "d:/zavd/app/(dashboard)/dashboard/webbplats/startsida/page.tsx";
let content = fs.readFileSync(file, "utf8");

const startMarker = "\t\t\t\t\t\t{/* Intro Section Tab */}";
const endMarker = "\t\t\t\t\t\t{/* Promo Banner Tab */}";
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("markers not found", startIdx, endIdx);
  process.exit(1);
}

const beforeBlock = content.substring(0, startIdx);
const afterBlock = content.substring(endIdx);

const t = "\t";
const t2 = "\t\t";
const t3 = "\t\t\t";
const t4 = "\t\t\t\t";
const t5 = "\t\t\t\t\t";
const t6 = "\t\t\t\t\t\t";
const t7 = "\t\t\t\t\t\t\t";
const t8 = "\t\t\t\t\t\t\t\t";
const t9 = "\t\t\t\t\t\t\t\t\t";
const t10 = "\t\t\t\t\t\t\t\t\t\t";
const t11 = "\t\t\t\t\t\t\t\t\t\t\t";
const t12 = "\t\t\t\t\t\t\t\t\t\t\t\t";
const t13 = "\t\t\t\t\t\t\t\t\t\t\t\t\t";
const t14 = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
const t15 = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
const t16 = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
const NL = "\r\n";

function field(tabs, name, label, placeholder, desc) {
  let lines = [
    tabs + "<FormField",
    tabs + t + "control={form.control}",
    tabs + t + `name="${name}"`,
    tabs + t + "render={({ field }) => (",
    tabs + t + t + "<FormItem>",
    tabs + t + t + t + `<FormLabel>${label}</FormLabel>`,
    tabs + t + t + t + "<FormControl>",
    tabs + t + t + t + t + `<Input {...field} value={field.value || ""} placeholder="${placeholder}" />`,
    tabs + t + t + t + "</FormControl>",
  ];
  if (desc) lines.push(tabs + t + t + t + `<FormDescription>${desc}</FormDescription>`);
  lines = lines.concat([
    tabs + t + t + t + "<FormMessage />",
    tabs + t + t + "</FormItem>",
    tabs + t + ")}",
    tabs + "/>",
  ]);
  return lines.join(NL);
}

function textareaField(tabs, name, label, placeholder, rows) {
  return [
    tabs + "<FormField",
    tabs + t + "control={form.control}",
    tabs + t + `name="${name}"`,
    tabs + t + "render={({ field }) => (",
    tabs + t + t + "<FormItem>",
    tabs + t + t + t + `<FormLabel>${label}</FormLabel>`,
    tabs + t + t + t + "<FormControl>",
    tabs + t + t + t + t + `<Textarea {...field} value={field.value || ""} placeholder="${placeholder}" rows={${rows}} />`,
    tabs + t + t + t + "</FormControl>",
    tabs + t + t + t + "<FormMessage />",
    tabs + t + t + "</FormItem>",
    tabs + t + ")}",
    tabs + "/>",
  ].join(NL);
}

function mediaField(tabs, name, label) {
  return [
    tabs + "<FormField",
    tabs + t + "control={form.control}",
    tabs + t + `name="${name}"`,
    tabs + t + "render={({ field }) => (",
    tabs + t + t + "<FormItem>",
    tabs + t + t + t + `<FormLabel>${label}</FormLabel>`,
    tabs + t + t + t + "<FormControl>",
    tabs + t + t + t + t + "<MediaPicker",
    tabs + t + t + t + t + t + `type="image"`,
    tabs + t + t + t + t + t + `value={field.value || ""}`,
    tabs + t + t + t + t + t + `onChange={(url) => field.onChange(url || "")}`,
    tabs + t + t + t + t + t + "showPreview",
    tabs + t + t + t + t + "/>",
    tabs + t + t + t + "</FormControl>",
    tabs + t + t + t + "<FormMessage />",
    tabs + t + t + "</FormItem>",
    tabs + t + ")}",
    tabs + "/>",
  ].join(NL);
}

const newBlock = [
  t6 + "{/* Intro Section Tab */}",
  t6 + `<TabsContent value="intro-section" className="space-y-6">`,
  t7 + "<Card>",
  t8 + "<CardHeader>",
  t9 + "<CardTitle>Intro Section</CardTitle>",
  t9 + "<CardDescription>",
  t10 + "Two-column section below the hero. Left: text content. Right: image/logo.",
  t9 + "</CardDescription>",
  t8 + "</CardHeader>",
  t8 + `<CardContent className="space-y-4">`,
  field(t9, "introSection.badge", "Badge Label", "e.g. Integration", "Small label shown above the title with a colored accent line."),
  field(t9, "introSection.title", "Title", "Integration"),
  field(t9, "introSection.subtitle", "Subtitle", "Short bold subtitle..."),
  textareaField(t9, "introSection.description", "Description", "Paragraph text...", 4),
  t9 + `<div className="grid grid-cols-2 gap-4">`,
  field(t10, "introSection.ctaText", "CTA Button Text", "Read more..."),
  field(t10, "introSection.ctaHref", "CTA Link URL", "/about"),
  t9 + "</div>",
  mediaField(t9, "introSection.image", "Right Side Image / Logo"),
  t8 + "</CardContent>",
  t7 + "</Card>",
  "",
  t7 + "{/* Partner Logos Card */}",
  t7 + "<Card>",
  t8 + "<CardHeader>",
  t9 + "<CardTitle>Partner Logos</CardTitle>",
  t9 + "<CardDescription>",
  t10 + "Logos shown at the bottom of the intro section. Leave image empty to show name as text.",
  t9 + "</CardDescription>",
  t8 + "</CardHeader>",
  t8 + `<CardContent className="space-y-4">`,
  t9 + "{partnerLogoFields.map((logoField, index) => (",
  t10 + `<div key={logoField.id} className="border rounded-lg p-4 space-y-3 relative">`,
  t11 + `<div className="flex items-center justify-between">`,
  t12 + `<span className="text-sm font-medium text-muted-foreground">Partner {index + 1}</span>`,
  t12 + "<Button",
  t13 + `type="button"`,
  t13 + `variant="ghost"`,
  t13 + `size="sm"`,
  t13 + `onClick={() => removePartnerLogo(index)}`,
  t13 + `className="text-destructive hover:text-destructive"`,
  t12 + ">",
  t13 + "Remove",
  t12 + "</Button>",
  t11 + "</div>",
  t11 + `<div className="grid grid-cols-2 gap-3">`,
  field(t12, "`introSection.partnerLogos.${index}.name`", "Name", "Partner name"),
  field(t12, "`introSection.partnerLogos.${index}.href`", "Link URL (optional)", "https://..."),
  t11 + "</div>",
  mediaField(t11, "`introSection.partnerLogos.${index}.image`", "Logo Image"),
  t10 + "</div>",
  t9 + "))}",
  t9 + "<Button",
  t10 + `type="button"`,
  t10 + `variant="outline"`,
  t10 + `size="sm"`,
  t10 + `onClick={() => appendPartnerLogo({ image: "", name: "", href: "" })}`,
  t9 + ">",
  t10 + "+ Add Partner",
  t9 + "</Button>",
  t8 + "</CardContent>",
  t7 + "</Card>",
  t6 + "</TabsContent>",
  "",
].join(NL);

const newContent = beforeBlock + newBlock + afterBlock;
fs.writeFileSync(file, newContent, "utf8");
console.log("Done! File written successfully.");
