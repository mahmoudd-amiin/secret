import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="p-8 bg-gray-50 text-right">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">شروط الاستخدام</h1>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">مقدمة</h2>
        <p className="text-gray-700 leading-relaxed">
          باستخدامك لموقعنا، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي من الشروط، يجب عليك التوقف عن استخدام الموقع.
        </p>
      </section>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">1. استخدام الموقع</h2>
        <p className="text-gray-700 leading-relaxed">
          يحق لك استخدام الموقع فقط للأغراض القانونية. يُمنع استخدام الموقع في أي نشاط غير قانوني أو ضار.
        </p>
      </section>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">2. التعديلات على الموقع</h2>
        <p className="text-gray-700 leading-relaxed">
          نحتفظ بالحق في تعديل أو إزالة أي محتوى على الموقع في أي وقت دون إشعار مسبق.
        </p>
      </section>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">3. حقوق الملكية الفكرية</h2>
        <p className="text-gray-700 leading-relaxed">
          جميع المحتويات على الموقع محمية بموجب حقوق الطبع والنشر. لا يجوز لك نسخ أو توزيع أو استخدام المحتوى دون إذن من مالك الموقع.
        </p>
      </section>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">4. مسؤوليتنا</h2>
        <p className="text-gray-700 leading-relaxed">
          لا يتحمل الموقع أي مسؤولية عن الأضرار الناتجة عن استخدام الموقع أو المعلومات المتاحة عليه.
        </p>
      </section>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">5. الحسابات الشخصية</h2>
        <p className="text-gray-700 leading-relaxed">
          يجب عليك الحفاظ على سرية معلومات حسابك وكلمة المرور، وأنت مسؤول عن أي نشاط يحدث تحت حسابك.
        </p>
      </section>
    
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">6. القانون المعمول به</h2>
        <p className="text-gray-700 leading-relaxed">
          تخضع هذه الشروط وتفسر وفقًا لقوانين [npmجمهورية مصر العربية]، وأي نزاع يتعلق بها سيتم حله أمام المحاكم المختصة.
        </p>
      </section>
    </div>
  );
};

export default TermsOfUse;
