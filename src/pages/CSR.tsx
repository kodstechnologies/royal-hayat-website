import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Heart, Users, Globe, Leaf, GraduationCap, HandHeart } from "lucide-react";

const CSR = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className="min-h-screen bg-background pt-[var(--header-height,56px)]">
      <Header />

      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimationWrapper>
            <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-3">{isAr ? "التزامنا" : "Our Commitment"}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              {isAr ? "الاحتفاء بالحياة" : "Celebrating Life"}
            </h1>
            <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto text-justify">
              {isAr
                ? "معلم مميز من مستشفى رويال حياة، تم إنشاؤه ليرمز إلى التجديد والوحدة وجمال الحياة."
                : "A signature landmark by Royale Hayat Hospital, created to symbolize renewal, unity, and the beauty of life."}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Video Section */}
      <section className="pb-16 bg-primary/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-black"
          >
            <video
              src="https://res.cloudinary.com/dqznbmfja/video/upload/v1776248697/Land_Mark_Opening_Coverage_xrvvgf.mp4"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              className="w-full h-full aspect-video object-cover pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
          <div className="max-w-3xl mx-auto mt-8 space-y-4">
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
              {isAr
                ? "بإلهام من رؤية للشفاء تتجاوز جدران المستشفى، يمزج الصرح بين الفن والطبيعة والتصميم المعاصر في بيان حضري ذو مغزى."
                : "Inspired by a vision of healing that extends beyond hospital walls, the monument blends art, nature, and contemporary design into a meaningful urban statement."}
            </p>
            <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
              {isAr
                ? "بشكله الدائري الذي يمثل الاستمرارية وزهرته المتفتحة التي تعكس النمو والحيوية، يقف هذا المعلم كتحية للأمل والعافية والتواصل المجتمعي. أكثر من مجرد هيكل، إنه هدية للكويت - يجمّل أفق المدينة بينما يجسد التزاماً راسخاً بالرحمة والرعاية والتفاؤل للأجيال القادمة."
                : "With its circular form representing continuity and its blooming flower reflecting growth and vitality, the landmark stands as a tribute to hope, wellness, and community connection. More than a structure, it is a gift to Kuwait - beautifying the cityscape while embodying a lasting commitment to compassion, care, and optimism for generations to come."}
            </p>
            <p className="font-serif text-xl text-primary text-center italic mt-6">
              {isAr ? "مستشفى رويال حياة ... أكثر من مجرد رعاية، شريك للحياة" : "Royale Hayat Hospital ... More than care, A partner for life"}
            </p>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-10">
            <ScrollAnimationWrapper>
              <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
                <h3 className="font-serif text-2xl text-foreground text-center">
                  {isAr ? "محاضرة التوعية بسرطان الثدي – جلسة داخل المستشفى أقيمت في 7 أكتوبر 2025" : "Breast Cancer Awareness Lecture - Hospital Session held on 7 October 2025"}
                </h3>
                <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
                  <img src="/images/doctors/image4.png.png" alt="Breast Cancer Awareness Hospital Session" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "داخل جدرانه، استضاف مستشفى رويال حياة محاضرة حصرية للتوعية بسرطان الثدي بقيادة فريقنا من الاستشاريين الخبراء. ركزت الجلسة على الكشف المبكر، وخيارات العلاج المتقدمة، والرعاية الشاملة للمرضى، بما في ذلك الرفاهية العاطفية."
                      : "Within its walls, Royale Hayat Hospital hosted an exclusive Breast Cancer Awareness lecture led by our team of expert consultants. The session emphasized early detection, advanced treatment options, and holistic patient care, including emotional well-being."}
                  </p>
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "تعكس هذه المبادرة الفاخرة والمعلوماتية تفانينا في تمكين النساء بالمعرفة والرحمة ومعايير الرعاية الصحية الاستثنائية."
                      : "This luxurious and informative initiative reflects our dedication to empowering women with knowledge, compassion, and exceptional healthcare standards."}
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
                <h3 className="font-serif text-2xl text-foreground text-center">
                  {isAr ? "محاضرة التوعية بسرطان الثدي – بنك برقان أقيمت في 16 أكتوبر 2025" : "Breast Cancer Awareness Lecture - Burgan Bank Session held on 16 October 2025"}
                </h3>
                <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
                  <img src="/images/doctors/image.png.png" alt="Breast Cancer Awareness Session at Burgan Bank" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "كجزء من مبادراته المجتمعية المميزة، استضاف مستشفى رويال حياة محاضرة متميزة للتوعية بسرطان الثدي في بنك برقان. أرشد مستشارونا النخبة الحضور خلال أهمية الكشف المبكر والفحص الذاتي والممارسات الصحية الاستباقية، مما مكن النساء بالمعرفة والثقة."
                      : "As part of its signature community initiatives, Royale Hayat Hospital hosted a distinguished Breast Cancer Awareness lecture at Burgan Bank. Our elite consultants guided attendees through the importance of early detection, self-examination, and proactive health practices, empowering women with knowledge and confidence."}
                  </p>
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "تجسد هذه المبادرة تفاني رويال حياة في الرعاية الصحية الوقائية ورفع مستوى الوعي بالصحة العامة."
                      : "This initiative epitomizes Royale Hayat’s dedication to preventive healthcare and elevating public health awareness."}
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
                <h3 className="font-serif text-2xl text-foreground text-center">
                  {isAr ? "شارك مستشفى رويال حياة في الفعالية الثالثة للفحص الصحي للأولمبياد الخاص الكويتي التي أقيمت في 22 أكتوبر 2025" : "Royale Hayat Hospital participated in the 3rd Special Olympics Kuwait Health Screening Event held on 22 October 2025"}
                </h3>
                <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
                  <img src="/images/doctors/image2.png.png" alt="Special Olympics Health Screening" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "شارك مستشفى رويال حياة بفخر فريقاً طبياً متخصصاً بقيادة الدكتورة علياء علي إبراهيم، استشارية الأمراض الباطنية والجهاز التنفسي. قدمت المبادرة فحوصات صحية أساسية لـ 150 رياضياً من ذوي الاحتياجات الخاصة في دولة الكويت."
                      : "Royale Hayat Hospital proudly participated in the 3rd Special Olympics Kuwait Health Screening Event through its dedicated medical team led by Dr. Alia Ali Ibrahim, Consultant in Internal and Respiratory Medicine. The initiative provided essential health screenings for 150 athletes with special needs across the State of Kuwait."}
                  </p>
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "يعكس هذا الالتزام تفاني المستشفى المستمر بالتواصل المجتمعي والشمولية وتعزيز الوصول إلى رعاية صحية شاملة ورحيمة للجميع - وخاصة أبطال العزيمة."
                      : "This reflects the hospital’s continued commitment to community engagement, inclusivity, and promoting access to comprehensive, compassionate healthcare for all—especially athletes of determination."}
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper>
              <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y border-border/40 bg-primary/5 px-6 py-10 md:px-8 space-y-6">
                <h3 className="font-serif text-2xl text-foreground text-center">
                  {isAr ? "المؤتمر الدولي لمستشفى رويال حياة حول مستجدات صحة المرأة الذي أقيم في 29 نوفمبر 2025" : "Royale Hayat Hospital's International Conference on Updates in Women's Health held on 29 November 2025"}
                </h3>
                <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl aspect-video bg-muted">
                  <img src="/images/doctors/image3.png.png" alt="Women's Health International Conference" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "تشرف مستشفى رويال حياة باستضافة مؤتمر علمي حصري رفيع المستوى حول أحدث التطورات في صحة المرأة. اجتمع نخبة من الأطباء والاستشاريين من جميع أنحاء العالم لتبادل الرؤى واستعراض أفضل الممارسات واستكشاف الأساليب المبتكرة في رعاية صحة المرأة."
                      : "Royale Hayat Hospital had the honor of hosting an exclusive, high-level scientific conference on the latest advancements in women's health. Esteemed doctors and consultants from across the globe gathered to exchange insights, showcase best practices, and explore innovative approaches in women's healthcare."}
                  </p>
                  <p className="font-body text-base text-muted-foreground leading-relaxed text-justify">
                    {isAr
                      ? "يعكس هذا الحدث المرموق التزامنا الراسخ بتقديم رعاية قائمة على الأدلة وبمعايير عالمية للنساء في الكويت والمنطقة."
                      : "This prestigious event reflects our unwavering commitment to delivering world-class, evidence-based care for women in Kuwait and the region."}
                  </p>
                </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>

      {/* Vision */}
      {/* <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <ScrollAnimationWrapper>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-6">
              {isAr ? "رؤيتنا للمسؤولية الاجتماعية" : "Our CSR Vision"}
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed text-center">
              {isAr
                ? "نسعى لأن نكون نموذجاً يُحتذى به في المسؤولية الاجتماعية في قطاع الرعاية الصحية بالكويت. من خلال مبادراتنا المتنوعة، نهدف إلى تعزيز صحة المجتمع وتمكين موظفينا وحماية البيئة وبناء شراكات مستدامة تحقق أثراً إيجابياً دائماً."
                : "We aspire to be a role model in corporate social responsibility within Kuwait's healthcare sector. Through our diverse initiatives, we aim to enhance community health, empower our employees, protect the environment, and build sustainable partnerships that create lasting positive impact."}
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section> */}

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CSR;
