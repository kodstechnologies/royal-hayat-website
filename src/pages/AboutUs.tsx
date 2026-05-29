import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import ChairmanMessage from "@/components/ChairmanMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Star, Sparkles, Shield, Target, BookOpen, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getAllLeadership,
  descriptionToParagraphs,
  type LeadershipItem,
} from "@/api/leadership";

type Leader = {
  id: string;
  initials: string;
  initialsAr: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  bioEn: string[];
  bioAr: string[];
  image?: string;
};

const mapApiToLeader = (item: LeadershipItem): Leader => ({
  id: item._id ?? item.name,
  initials: item.initials,
  initialsAr: item.initialsArabic || item.initials,
  nameEn: item.name,
  nameAr: item.nameArabic,
  roleEn: item.title,
  roleAr: item.titleArabic,
  bioEn: descriptionToParagraphs(item.description ?? ""),
  bioAr: descriptionToParagraphs(item.descriptionArabic ?? ""),
  image: item.image,
});

const LeaderCard = ({ leader, lang }: { leader: Leader; lang: string }) => {
  const [expanded, setExpanded] = useState(false);
  const name = lang === "ar" ? leader.nameAr : leader.nameEn;
  const role = lang === "ar" ? leader.roleAr : leader.roleEn;
  const bio = lang === "ar" ? leader.bioAr : leader.bioEn;
  const roles = role.split("\n");
  const displayInitials = lang === "ar" ? leader.initialsAr : leader.initials;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-popover border border-border/50 rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Photo / Avatar side */}
        <div className="md:w-64 flex-shrink-0 bg-primary/5 flex items-center justify-center p-8 md:p-10">
          <div className={`w-44 h-44 md:w-60 md:h-60 rounded-2xl flex items-center justify-center border-4 border-primary/20 overflow-hidden ${leader.image ? "bg-white" : "bg-primary/10"}`}>
            {leader.image ? (
              <img
                src={leader.image}
                alt={name}
                className="w-full h-full object-contain md:object-cover md:object-top bg-white"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-serif text-primary">{displayInitials}</span>
            )}
          </div>
        </div>
        {/* Info side */}
        <div className="flex-1 p-6 md:p-8">
          <h3 className={`font-serif text-xl text-foreground mb-1 ${lang === "ar" ? "rtl-text" : ""}`}>{name}</h3>
          <div className="space-y-0.5 mb-4">
            {roles.map((r, i) => (
              <p key={i} className={`font-body text-sm text-accent ${lang === "ar" ? "rtl-text" : ""}`}>
                {r}
              </p>
            ))}
          </div>
          <div className={`space-y-3 overflow-hidden transition-all duration-500 ${expanded ? "max-h-[2000px]" : "max-h-[100px]"}`}>
            {bio.map((p, i) => (
              <p
                key={i}
                lang={lang === "ar" ? "ar" : "en"}
                dir={lang === "ar" ? "rtl" : "ltr"}
                className="font-body text-sm text-muted-foreground leading-relaxed text-justify [text-align-last:start]"
              >
                {p}
              </p>
            ))}
          </div>
          {bio.length > 1 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-primary font-body text-xs tracking-wide mt-3 hover:underline"
            >
              {expanded
                ? (lang === "ar" ? "عرض أقل" : "Show Less")
                : (lang === "ar" ? "اقرأ المزيد" : "Read More")}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AboutUs = () => {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const showAll = !section;
  const show = (s: string) => showAll || section === s;
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [leadersLoading, setLeadersLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [section]);

  useEffect(() => {
    let cancelled = false;

    const loadLeaders = async () => {
      setLeadersLoading(true);
      try {
        const items = await getAllLeadership();
        if (cancelled) return;
        setLeaders(items.map(mapApiToLeader));
      } catch {
        if (!cancelled) setLeaders([]);
      } finally {
        if (!cancelled) setLeadersLoading(false);
      }
    };

    void loadLeaders();
    return () => {
      cancelled = true;
    };
  }, []);

  const values = [
    { icon: Heart, titleKey: "patientCenteredCare", descKey: "patientCenteredCareDesc" },
    { icon: Heart, titleKey: "compassion", descKey: "compassionDesc" },
    { icon: Star, titleKey: "passionForExcellence", descKey: "passionForExcellenceDesc" },
    { icon: Sparkles, titleKey: "innovation", descKey: "innovationDesc" },
    { icon: Shield, titleKey: "integrityProfessionalism", descKey: "integrityProfessionalismDesc" },
  ];

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)] [&_.text-accent]:text-[#816107]">
      <Header />

      {/* Hero */}
      {section !== "chairman" && (
        <section className="pt-12 pb-6 md:pt-16 md:pb-8 bg-primary/5">
          <div className="container mx-auto px-6 text-center">
            <ScrollAnimationWrapper>
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                {t("getToKnowUs")}
              </p>
              <h1
                className={`text-4xl md:text-5xl font-serif text-foreground mb-4 text-center ${
                  lang === "ar" ? "rtl-text-center" : ""
                }`}
              >
                {section === "history"
                  ? lang === "ar"
                    ? "قصتنا"
                    : "Our Story"
                  : section === "mission"
                    ? lang === "ar"
                      ? "الرسالة والقيم"
                      : "Mission & Values"
                    : section === "csr"
                      ? t("csrCelebratingLife")
                      : section === "leadership"
                        ? lang === "ar"
                          ? "فريق القيادة"
                          : "Leadership Team"
                        : t("aboutUs")}
              </h1>
              {showAll && (
                <p
                  className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-justify ${
                    lang === "ar" ? "rtl-text" : ""
                  }`}
                >
                  {t("storyP1")}
                </p>
              )}
            </ScrollAnimationWrapper>
          </div>
        </section>
      )}

      {/* Our History - FULL content from doc */}
      {show("history") && (
        <section className="pb-16 pt-2 bg-background" id="history">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-10">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                  {t("ourStory")}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">{t("historyTitle")}</h2>
              </div>
            </ScrollAnimationWrapper>
            <div className="max-w-4xl mx-auto space-y-5">
              {[
                t("historyP1"),
                t("historyP2"),
                t("historyP3"),
                t("historyP4"),
                t("historyP5"),
                t("historyP6"),
                t("historyP7"),
                t("historyP8"),
              ].map((p, i) => {
                const hasHtml = p.includes("<") && p.includes(">");
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`font-body text-sm md:text-base text-muted-foreground leading-relaxed text-justify ${
                      lang === "ar" ? "rtl-text" : ""
                    }`}
                    {...(hasHtml ? { dangerouslySetInnerHTML: { __html: p } } : {})}
                  >
                    {!hasHtml ? p : null}
                  </motion.p>
                );
              })}
            </div>
          </div>
        </section>
      )}




      {/* Mission & Values */}
      {show("mission") && (
        <section className="pb-16 pt-2 bg-secondary/10" id="mission">
          <div className="container mx-auto px-6">
            <ScrollAnimationWrapper>
              <div className="text-center mb-10">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                  <Target className="w-4 h-4 inline mr-1" />
                  {t("ourMission")}
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{t("missionStatement")}</h2>
                <p
                  className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto italic leading-relaxed ${
                    lang === "ar" ? "rtl-text" : ""
                  }`}
                >
                  &ldquo;{t("missionText")}&rdquo;
                </p>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="text-center mb-8 mt-12">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{t("ourValues")}</p>
              </div>
            </ScrollAnimationWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {values.map((v, i) => (
                <motion.div
                  key={v.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-popover border border-border/50 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className={`font-serif text-base text-foreground mb-2 ${lang === "ar" ? "rtl-text" : ""}`}>
                    {t(v.titleKey)}
                  </h3>
                  <p
                    className={`font-body text-sm text-muted-foreground leading-relaxed ${
                      lang === "ar" ? "rtl-text" : ""
                    }`}
                  >
                    {t(v.descKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Chairman's Message */}
      {show("chairman") && (
        <>
          <section className="pt-12 pb-0 bg-background">
            <div className="container mx-auto px-4 md:px-6">
              <ScrollAnimationWrapper>
                <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[88rem] mx-auto">
                  <h1
                    className={`text-4xl md:text-5xl font-serif text-foreground mb-4 text-left lg:pl-[42%] xl:pl-[40%] ${
                      lang === "ar" ? "rtl-text" : ""
                    }`}
                  >
                    {t("chairmanMessage")}
                  </h1>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>
          <ChairmanMessage />
        </>
      )}

      {/* Leadership Team */}
      {show("leadership") && <section className="pb-16 pt-16 bg-muted/20" id="leadership">
        <div className="container mx-auto px-6">
          <ScrollAnimationWrapper>
            <div className="text-center mb-10">
              <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                <Users className="w-4 h-4 inline mr-1" />
                {t("leadership")}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4">{t("leadershipSubtitle")}</h2>
              <p
                className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto leading-relaxed ${
                  lang === "ar" ? "rtl-text" : ""
                }`}
              >
                {t("leadershipDesc")}
              </p>
            </div>
          </ScrollAnimationWrapper>

          <div className="max-w-5xl mx-auto space-y-6">
            {leadersLoading && (
              <>
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
              </>
            )}

            {!leadersLoading && leaders.length === 0 && (
              <p
                className={`text-center text-muted-foreground font-body text-sm py-8 ${
                  lang === "ar" ? "rtl-text" : ""
                }`}
              >
                {lang === "ar" ? "لا يوجد أعضاء قيادة متاحون حالياً." : "No leadership profiles available at the moment."}
              </p>
            )}

            {!leadersLoading &&
              leaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} lang={lang} />
              ))}
          </div>
        </div>
      </section>}


      {/* CSR */}
      {show("csr") && (
        <Link to="/csr" className="block">
          <section className="pb-16 pt-2 bg-background cursor-pointer hover:bg-primary/5 transition">
            <div className="container mx-auto px-6">
              <ScrollAnimationWrapper>
                <div className="text-center mb-10">
                  <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {t("csrEyebrow")}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4 text-center">
                    {t("csrCelebratingLife")}
                  </h2>
                  <div
                    className={`text-muted-foreground font-body text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-justify space-y-4 ${
                      lang === "ar" ? "rtl-text" : ""
                    }`}
                  >
                    {[t("csrAboutP1"), t("csrAboutP2"), t("csrAboutP3")].map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                    <p className={`font-serif text-foreground pt-2 text-center ${lang === "ar" ? "rtl-text-center" : ""}`}>
                      {t("csrAboutTagline")}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </section>
        </Link>
      )}


      <style>{`
        .rtl-text {
          direction: rtl;
          text-align: right;
        }
        .rtl-text-center {
          direction: rtl;
          text-align: center;
        }
        #leadership [dir="rtl"].text-justify {
          -webkit-hyphens: none;
          hyphens: none;
        }
      `}</style>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AboutUs;
