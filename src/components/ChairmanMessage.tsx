import { useLanguage } from "@/contexts/LanguageContext";
import ScrollAnimationWrapper from "./ScrollAnimationWrapper";

const ChairmanMessage = () => {
  const { lang } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl lg:max-w-7xl 2xl:max-w-[88rem] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-12 items-center lg:items-start">
            <div className="w-full lg:w-[38%] xl:w-[36%] flex-shrink-0 flex justify-center lg:justify-start lg:mt-6 xl:mt-8">
              <div className="relative mx-auto w-full max-w-[320px] md:max-w-[420px] lg:max-w-none lg:w-full">
                <div className="relative w-full pt-[115%] md:pt-[118%] lg:pt-[128%] xl:pt-[124%] rounded-2xl overflow-hidden bg-primary/5 shadow-lg lg:shadow-xl">
                  <picture className="absolute inset-0 block size-full">
                    <source media="(max-width: 767px)" srcSet="https://royal-hayat.s3.eu-central-1.amazonaws.com/chairman/Chairman-mobile.jpeg" />
                    <source media="(min-width: 768px)" srcSet="https://royal-hayat.s3.eu-central-1.amazonaws.com/chairman/Chairman-web.jpeg" />
                    <img
                      src="https://royal-hayat.s3.eu-central-1.amazonaws.com/chairman/Chairman-web.jpeg"
                      alt={lang === "ar" ? "رئيس مجلس رويال حياة التنفيذي" : "Chairman, Royale Hayat Executive Board"}
                      className="absolute inset-0 size-full object-cover object-top"
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-w-0 space-y-4 md:space-y-5 lg:pt-1">
              <ScrollAnimationWrapper>
                {/* <div>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-2">
                    {lang === "ar" ? "برادييب ك. هاندا" : "Pradeep K Handa"}
                  </h2>
                  <p className="text-accent font-body text-sm md:text-base">
                    {lang === "ar"
                      ? "رئيس مجلس رويال حياة التنفيذي"
                      : "Chairman, Royale Hayat Executive Board"}
                  </p>
                </div> */}

                <div className="space-y-4 lg:space-y-3.5 mt-4 md:mt-6 lg:pt-1">
                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify">
                    {lang === "ar" ? "عزيزي المريض / الزائر،" : "Dear Patient / Visitor,"}
                  </p>

                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify">
                    {lang === "ar"
                      ? "انطلقت رحلتنا في مستشفى رويال حياة عام 2006 برؤية واضحة تتمثل في إنشاء مؤسسة رعاية صحية يوجّه فيها التميز الطبي العالمي بمبادئ الضيافة الحقيقية. وقد تطوّر ما بدأ كمركز متخصص في صحة المرأة والطفل ليصبح مستشفى متعدد التخصصات رائداً ووجهة موثوقة للرعاية المتقدمة والضيافة."
                      : "At Royale Hayat Hospital, our journey began in 2006 with a clear vision to create a healthcare institution where world-class medical expertise is guided by the principles of genuine hospitality. What began as a specialized center for women's and children's health has evolved into a leading multi-specialty hospital and a trusted destination for advanced care and hospitality."}
                  </p>

                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify">
                    {lang === "ar"
                      ? "لقد صممنا بعناية بيئة يُؤخذ فيها كل تفصيل بعين الاعتبار، وتُنسَّق فيها كل تفاعل بدقة. نؤمن أن جوهر فكرة المستشفى يكمن في الضيافة — أي العناية بالناس بدفء وكرامة واحترام. يحدّد هذا الفلسفة «تجربة رويال حياة»، حيث تُقدَّم الرعاية الصحية المتقدمة باهتمام وتقدير ولمسة شخصية عميقة."
                      : "We have thoughtfully shaped an environment where every detail is considered, and every interaction is carefully curated. We believe that at its core, the very idea of a hospital is rooted in hospitality the act of caring for people with warmth, dignity, and respect. This philosophy defines The Royale Hayat Experience, where advanced healthcare is delivered with attentiveness, discretion, and a deeply personalized touch."}
                  </p>

                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify">
                    {lang === "ar"
                      ? "وفي صميم فلسفتنا التزام برعاية المرضى يتجاوز التوقعات. صُممت كل تجربة لتعكس مستوى من الاهتمام والرقي يضمن أن يشعر كل فرد بأنه محترم ومقدَّر ورعايته استثنائية في كل مرحلة من رحلته."
                      : "At the heart of our philosophy lies a commitment to patient care that goes beyond expectation. Every experience is thoughtfully designed to reflect a level of attention and refinement that ensures each individual feels valued, respected, and exceptionally cared for at every stage of their journey."}
                  </p>

                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify">
                    {lang === "ar"
                      ? "يقوم تميّزنا على قوة فريقنا من الأطباء والممرضين والمتخصصين السريريين؛ فخبرتهم وتفانيهم والتزامهم الهادئ بالتميز يحدّد هويتنا. إن اعترافنا كأفضل مستشفى في الكويت لمدة 16 عاماً يعكس مساهمتهم والثقة الدائمة لمرضانا ومجتمعنا."
                      : "Our distinction is built upon the strength of our team our physicians, nurses, and clinical professionals whose expertise, dedication, and quiet commitment to excellence define who we are. Being recognized as the Best Hospital in Kuwait for 16 years reflects their contribution and the enduring trust of our patients and community."}
                  </p>

                  <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed text-justify">
                    {lang === "ar"
                      ? "ونظراً إلى الأمام، يظل تركيزنا واضحاً: مواصلة التقدم في الرعاية الصحية من خلال الابتكار والنهج الشخصي العميق، مع الحفاظ على الدفء والاهتمام والتواصل الإنساني الذي يميّزنا. نيابة عن فريقنا بأسره، نتطلع إلى الترحيب بكم — ليس كمرضى فحسب، بل كجزء من عائلتنا الممتدة — وإلى أن تكون رحلتكم معرّفة بالراحة والثقة ورعاية استثنائية."
                      : "As we look ahead, our focus remains clear: to continue advancing healthcare through innovation and a deeply personalized approach, while preserving the warmth, attentiveness, and human connection that define us. On behalf of our entire team, we look forward to welcoming you not just as a patient, but as part of our extended family and ensuring your journey is defined by comfort, confidence, and exceptional care."}
                  </p>

                  <div className="pt-4 space-y-3">
                    <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                      {lang === "ar" ? "مع خالص التحيات،" : "Kindest regards,"}
                    </p>
                    <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                      {lang === "ar"
                        ? "مستشفى رويال حياة … وجهتكم لصحة أفضل وللاحتفاء بالحياة!"
                        : "Royale Hayat Hospital …your destination for better health and to celebrate life!"}
                    </p>
                    <p className="text-muted-foreground font-body text-sm md:text-base leading-relaxed">
                      {lang === "ar" ? "مع أطيب الأماني،" : "With best wishes,"}
                    </p>
                    <p className="font-serif text-xl md:text-2xl text-foreground pt-1">
                      {lang === "ar" ? "برادييب ك. هاندا" : "Pradeep K Handa"}
                    </p>
                    <p className="text-[#816107] font-body text-sm md:text-base leading-relaxed">
                      {lang === "ar"
                        ? "رئيس مجلس رويال حياة التنفيذي"
                        : "Chairman, Royale Hayat Executive Board"}
                    </p>
                  </div>
                </div>
              </ScrollAnimationWrapper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChairmanMessage;