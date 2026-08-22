import { Link } from "react-router-dom";
import {
  GraduationCap,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

const govLinks = [
  { label: "UIDAI (Aadhaar)", url: "https://uidai.gov.in" },
  { label: "Passport Seva", url: "https://www.passportindia.gov.in" },
  { label: "DigiLocker", url: "https://www.digilocker.gov.in" },
  { label: "Parivahan", url: "https://parivahan.gov.in" },
  { label: "MyGov India", url: "https://www.mygov.in" },
  { label: "India.gov.in", url: "https://www.india.gov.in" },
  { label: "UMANG", url: "https://web.umang.gov.in" },
  { label: "SWAYAM", url: "https://swayam.gov.in" },
];

export default function Footer() {
  return (
    <footer className="mt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/70 backdrop-blur-md pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 border-t border-white/60">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">StudentSathi</div>
                <div className="text-xs text-indigo-600 font-medium">Guidance · Not Application</div>
              </div>
            </Link>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              A citizen guidance portal that explains government documents, schemes, scholarships and women's safety resources in simple language. We link you to the <span className="font-semibold text-slate-800">official government websites</span> — we don't take your applications.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full glass flex items-center justify-center text-slate-600 hover:text-indigo-600 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Guides"
            links={[
              { label: "Documents", to: "/documents" },
              { label: "Schemes", to: "/schemes" },
              { label: "Scholarships", to: "/scholarships" },
            ]}
          />

          <FooterCol
            title="Resources"
            links={[
              { label: "Women Safety", to: "/women-safety" },
              { label: "Emergency Helplines", to: "/women-safety" },
            ]}
          />

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Official Portals</h4>
            <ul className="space-y-2.5">
              {govLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600 transition"
                  >
                    {l.label} <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/60 grid md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Emergency</div>
              <div className="font-semibold text-slate-900">112 · Women 1091 · Cyber 1930</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Support</div>
              <div className="font-semibold text-slate-900">hello@studentsathi.in</div>
            </div>
          </div>
          <div className="md:text-right text-slate-500">
            © {new Date().getFullYear()} StudentSathi · <Link to="/" className="hover:text-indigo-600">Privacy</Link> · <Link to="/" className="hover:text-indigo-600">Terms</Link>
          </div>
        </div>

        <div className="mt-8 text-[11px] text-slate-500 max-w-4xl leading-relaxed">
          <strong className="text-slate-700">Disclaimer:</strong> StudentSathi is an educational guidance portal. We are not affiliated with, endorsed by or a substitute for any government of India department. All applications must be made on the official government websites linked from each guide.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links
}) {
  return (
    <div>
      <h4 className="font-semibold text-slate-900 mb-4 text-sm">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-slate-600 hover:text-indigo-600 transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
