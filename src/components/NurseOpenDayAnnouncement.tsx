import ScrollAnimationWrapper from "@/components/ScrollAnimationWrapper";

type NurseOpenDayAnnouncementProps = {
  isAr: boolean;
};

const NurseOpenDayAnnouncement = ({ isAr }: NurseOpenDayAnnouncementProps) => (
  <ScrollAnimationWrapper>
    <div
      className="max-w-5xl mx-auto mb-10 rounded-2xl border border-primary/20 bg-popover p-6 md:p-8"
      lang={isAr ? "ar" : "en"}
      dir={isAr ? "rtl" : "ltr"}
    >
      {isAr ? (
        <div className="font-body text-sm text-foreground leading-relaxed space-y-6 text-right [&_li]:!text-right">
          <div className="space-y-2 text-right">
            <p className="text-lg md:text-xl font-semibold">وظائف شاغرة</p>
            <p className="text-lg md:text-xl font-semibold">يوم مفتوح</p>
            <p className="text-base md:text-lg font-medium">
              للممرضين والممرضات المسجلين
            </p>
          </div>

          <div className="space-y-3 text-right" dir="rtl">
            <p className="font-semibold text-base">التخصصات المطلوبة</p>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">تمريض غرف العمليات</span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">تمريض الإفاقة</span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">تمريض قسم الأطفال</span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">تمريض الولادة والنساء</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-right" dir="rtl">
            <p className="font-semibold text-base">الشروط</p>
            <ul className="space-y-2 list-none">
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">
                  ترخيص تمريض ساري من وزارة الصحة الكويتية.
                </span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">
                  يجب أن يكون ترخيص الـ إقامة/التأشيرة قابلين للتحويل.
                </span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">شهادة بكالوريوس في التمريض.</span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">خبرة لا تقل عن 3 سنوات.</span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">العمر أقل من 45 سنة.</span>
              </li>
              <li className="flex items-start gap-2 w-full">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                <span className="flex-1 text-right">
                  يرجى إحضار نسخ من جميع المستندات المطلوبة مع السيرة الذاتية.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2 text-right">
            <p>
              ندعوكم للانضمام إلينا في يوم التوظيف المفتوح والتعرف على الفرص
              الوظيفية المتاحة.
            </p>
            <p>
              <span className="font-semibold">التاريخ:</span> 27 أغسطس 2026
            </p>
            <p>
              <span className="font-semibold">الوقت:</span> من الساعة 10:00 صباحاً
              حتى 4:00 مساءً
            </p>
            <p>
              <span className="font-semibold">المكان:</span> مستشفى رويال حياة –
              الدور الأول، قاعة جاردينيا
            </p>
          </div>
        </div>
      ) : (
        <div className="font-body text-sm text-foreground leading-relaxed space-y-6 justified-body-en">
          <div className="space-y-2 text-center">
            <p className="text-accent text-xs tracking-[0.2em] uppercase font-body">
              We Are Hiring
            </p>
            <p className="text-lg md:text-xl font-semibold uppercase">Open Day</p>
            <p className="text-base md:text-lg font-semibold uppercase">
              Immediate Vacancy
            </p>
            <p className="text-base md:text-lg font-medium uppercase">
              For Registered Nurse
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-base uppercase">Required Specialties</p>
            <ul className="space-y-2 list-disc list-inside marker:text-foreground">
              <li>Operation Room Nurses</li>
              <li>PACU Nurses</li>
              <li>Pediatric Nurses</li>
              <li>Labor &amp; Delivery Nurses</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-base uppercase">Requirement</p>
            <ul className="space-y-2 list-disc list-inside marker:text-foreground">
              <li>Candidates must have valid Kuwait MOH Nursing license.</li>
              <li>MOH license &amp; Visa must be transferable.</li>
              <li>All Candidates must have Bachelor Degree in Nursing.</li>
              <li>Minimum 3 Years of Experience.</li>
              <li>Age limit less than 45 Years</li>
              <li>Along with your CV bring your documents copies.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <p>
              We invite you to join us at our Open Day and explore the available
              opportunities.
            </p>
            <p>
              <span className="font-semibold">Date:</span> 27th August 2026.
            </p>
            <p>
              <span className="font-semibold">Time:</span> 10:00 AM to 4:00 PM.
            </p>
            <p>
              <span className="font-semibold">Venue:</span> Royale Hayat Hospital
              – 1st Floor, Gardenia Hall.
            </p>
          </div>
        </div>
      )}
    </div>
  </ScrollAnimationWrapper>
);

export default NurseOpenDayAnnouncement;
