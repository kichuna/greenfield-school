import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, Calendar, FileText, BookOpen } from "lucide-react";
import { revalidatePath } from "next/cache";

interface Props {
  params: { id: string };
}

const STATUS_OPTIONS = [
  { value: "PENDING",      label: "Pending",      color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "UNDER_REVIEW", label: "Under Review",  color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "SHORTLISTED",  label: "Shortlisted",   color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "ACCEPTED",     label: "Accepted",      color: "bg-green-50 text-green-700 border-green-200" },
  { value: "REJECTED",     label: "Rejected",      color: "bg-red-50 text-red-700 border-red-200" },
];

async function updateStatus(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const id     = formData.get("id") as string;
  const status = formData.get("status") as string;

  await prisma.admissionApplication.update({
    where: { id },
    data:  { status: status as any },
  });

  revalidatePath(`/admin/admissions/${id}`);
  revalidatePath("/admin/admissions");
  revalidatePath("/admin/dashboard");
}

export default async function ApplicationDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const app = await prisma.admissionApplication.findUnique({
    where: { id: params.id },
    include: { documents: true },
  });

  if (!app) notFound();

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === app.status);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/admissions" className="btn-outline text-sm py-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            {app.firstName} {app.lastName}
          </h1>
          <p className="text-sm text-gray-500 font-mono">{app.referenceNumber}</p>
        </div>
        <span className={`badge border ml-auto ${currentStatus?.color ?? "bg-gray-50 text-gray-700 border-gray-200"} text-sm px-3 py-1`}>
          {currentStatus?.label ?? app.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Application details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Student info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-school-blue" />
              Student Information
            </h2>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Full Name</dt>
                <dd className="font-medium text-gray-900">{app.firstName} {app.lastName}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Date of Birth</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(app.dateOfBirth).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Gender</dt>
                <dd className="font-medium text-gray-900">{app.gender}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Nationality</dt>
                <dd className="font-medium text-gray-900">{app.nationality}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Grade Applying</dt>
                <dd className="font-medium text-gray-900">{app.gradeApplying}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Academic Year</dt>
                <dd className="font-medium text-gray-900">{app.academicYear}</dd>
              </div>
              {app.previousSchool && (
                <div className="sm:col-span-2">
                  <dt className="text-gray-400">Previous School</dt>
                  <dd className="font-medium text-gray-900">{app.previousSchool}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Parent / Guardian */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-school-blue" />
              Parent / Guardian
            </h2>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Name</dt>
                <dd className="font-medium text-gray-900">{app.parentName}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Relationship</dt>
                <dd className="font-medium text-gray-900">{app.parentRelationship}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Phone</dt>
                <dd className="font-medium text-gray-900">{app.parentPhone}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Email</dt>
                <dd className="font-medium text-gray-900">{app.parentEmail}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-gray-400">Address</dt>
                <dd className="font-medium text-gray-900">{app.address}</dd>
              </div>
            </dl>
          </div>

          {/* Additional info */}
          {app.additionalInfo && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-school-blue" />
                Additional Information
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{app.additionalInfo}</p>
            </div>
          )}

          {/* Documents */}
          {app.documents.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-school-blue" />
                Uploaded Documents ({app.documents.length})
              </h2>
              <ul className="space-y-2">
                {app.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-lg px-4 py-2.5">
                    <span className="text-gray-700">{doc.name}</span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-school-blue hover:underline text-xs"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Status & timeline */}
        <div className="space-y-6">
          {/* Update status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>
            <form action={updateStatus}>
              <input type="hidden" name="id" value={app.id} />
              <div className="space-y-2 mb-4">
                {STATUS_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      app.status === opt.value ? opt.color : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      defaultChecked={app.status === opt.value}
                      className="text-school-blue"
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
              <button type="submit" className="btn-primary w-full text-sm py-2.5">
                Save Status
              </button>
            </form>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-sm space-y-3">
            <h2 className="font-semibold text-gray-900">Application Meta</h2>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Submitted {new Date(app.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Updated {new Date(app.updatedAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
            <p className="font-mono text-xs text-gray-400 pt-1 border-t border-gray-100">{app.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
