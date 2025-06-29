import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const language = localStorage.getItem('language') || (navigator.language.startsWith('ar') ? 'ar' : 'en');

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    lng: language, // استخدم اللغة المخزنة
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React بالفعل يعمل escaping
    },
    resources: {
      en: {
        translation: {
          Currentattendees:"Current attendees",
          ActiveVolunteers:"Active Volunteers",
          CurrentTasks:"Current Tasks",
          CompletedTasks:"Completed Tasks",
          UsersCount:"Users Count",
          Topcities:"Top cities by request volume",
          Topcountries:"Top countries",
          Home:"Home",
          en: "Ar",
          Details: "Details",
          type: "Type",
          number: "Number",
          AllEvents: "All Events",
          created:" join date",
          AllTasks: "All Tasks",
          volunteers: "Volunteers",
          Eventname: "Event name",
          Pending: "Pending users",
          UserUpdated:"User updated successfully",
          UserAdded:"User added successfully",
          DateTimeDetails: "Date & Time Details",
          UserDeleted:"User deleted successfully",
          Organiztion: "Organiztion  ",
          Personal: "Personal Information  ",
          phonenuberinfor: "phone number  ",
          Gender: "Gender",
          feel:"status",
          Users: "Users ",
          Filter: "Filter",
          User: "User",
          Email: " Email",
          Phone: " Phone",
          Country: "Country",
          City: "City",
          Zone: "Zone",
          add: "Add",
          end: "End(time)",
          Status: "Status",
          Search: "Search",
          Events: "Events",
          Event: "Event",
          date: "Date",
          Tasks: "Tasks",
          Requests: "Requests",
          EditUser: "Edit User",
          AddUser: "Add User",
          Select_date: "Select date",
          Birthdate: "Birthdate",
          Password: "Password",
          Done: "Done",
          Complaint: "Complaint",
          Suggest: "Suggest",
          Back : "Back Identity",
          Front : "Front Identity",
          Selfie : "Selfie Image",
           Paper: "Organization Paper",
          Name: "Name",
          EventDetails: "Event Details",
          EventUpdated:"Event updated successfully",
          From_zone: "From zone",
          To_zone: "To zone",
          EventAdded:"Event added successfully",
          start: "Start(time)",
          Organization: "Organization",
          Total : "Total hours",
          Information: "Information",
          Total_hours: "Total hours",
          NetworkFailed: "Network failed",
          location: "Location",
          EditEvent: "Edit Event",
          Orgnization: "Orgnization",
          AddEvent: "Add Event",
          statue: "Status",
        description: "Description",
          organizers: "Organizers",
          image: "Image",
          place: "Place",
          Date_Time: "Date & Time",
          benfitAndrequirment: "Benefit and requirement",
          active: "Active",
          inactive: "Inactive",
          Requirements: "Requirements",
          Benefits: "Benefits",
          map: "Map location",
          EventInformation: "Event Information",
          time: "Time",
          EventBenefits: "Event Benefits",
          EventRequirements: "Event Requirements",
          Task: "Task",
          Edittask: "Edit Task",
          Addtask: "Add Task",
          number_of_volunteers: "Number of volunteers",
          EventLocation: "Event Location",
          numberneeded: "Number needed",
          Info: "Info",
          LocationMapLink : "Location & Map Link",
          MapLink: "Map Link",
          VolunteersOrganizersInformation: "Volunteers & Organizers Information",
          NumberofVolunteers: "Number of Volunteers",
          AvailableVolunteers: "Available Volunteers",
          NumberOfOrganizers: "Number Of Organizers",
          EventHours: "Event Hours",
          Taskname: "Task name",
          taskhours: "Task hours",
          Attendees: "Attendees",
          Issues: "Issues",
          Suggestions: "Suggestions",
          Norequirementsavailable: "No requirements available",
          title: "Title",
          View: "View",
          Accepted: "Accepted",
          Rejected: "Rejected",
          Attend: "Attendees",
          Lost: "Lost",
          SuggestionDetails: "Suggestion Details",
          phonenumber: "Phone number",
          Subject: "Subject",
          Close: "Close",
          Problem: "Problem",
          AudioProblem: " Problem",
          close: "Close",
          Suggestion: "Suggestion",
          read: "Read",
          googlemap: "Google map link",
          TotalVolunteers:"Total Volunteers"
        },
      },
      ar: {
        translation: {
          Currentattendees:"الحاضرين الحالين",
         ActiveVolunteers:"متطوعون نشطون",
          CurrentTasks:"المهام الحالية",
          CompletedTasks:"المهام المكتملة",
          UsersCount:"عدد المستخدمين",
          Topcities:"أفضل المدن حسب حجم الطلبات",
          Topcountries:"أعلي  الدول",
          TotalVolunteers:"إجمالي المتطوعين",
          Home:"الصفحة الرئسية",
          en: "En",
          Suggestion: "اقتراح",
          View: "عرض",
          Close: "إغلاق",
          AudioProblem: "مشكلة ",
          SuggestionDetails: "تفاصيل الاقتراح",
          read: "قراءة",
          Subject: "الموضوع",
          created:"يوم التسجيل",
          Problem: "المشكلة",
          Accepted: "مقبول",
          phonenumber: "رقم الهاتف",
          Rejected: "مرفوض",
          Attend: "حضور",
          Lost: "مفقود",
          Task: "المهمة",
          title: "العنوان",
          Issues: "المشاكل",
          Norequirementsavailable: "لا توجد متطلبات متاحة",
          Suggestions: "الاقتراحات",
          taskhours: "ساعات المهمة",
          EventDetails: "تفاصيل الفعالية",
          Taskname: "اسم المهمة",
          Attendees: "الحضور",
          LocationMapLink : "رابط الموقع والخريطة",
          number: "الرقم",  
          NumberofVolunteers: "عدد المتطوعين",
          NumberOfOrganizers: "عدد المنظمين",
          AvailableVolunteers: "المتطوعين المتاحين",
          Details: "التفاصيل",  
          MapLink: "رابط الخريطة",
          EventHours: "ساعات الفعالية",
          VolunteersOrganizersInformation: "معلومات المتطوعين والمنظمين",
          type: "النوع",
          Orgnization: "المنظمة",
          Pending: "المعلقين",
          add: "إضافة",
          Info: "المعلومات",
          Eventname: "اسم الفعالية",
          DateTimeDetails: "تفاصيل التاريخ والوقت",
          AllEvents: "جميع الفعاليات",
          AllTasks: "جميع المهام",
          numberneeded: "عدد المطلوب",
          Addtask: "إضافة مهمة",
          EventLocation: "موقع الفعالية",
          number_of_volunteers: "عدد المتطوعين",
          Edittask: "تعديل المهمة",
          map: "موقعه علي الخريطة",
          EventRequirements: "متطلبات الفعالية",
          Benefits: "الفوائد",
          EventInformation: "معلومات الفعالية",
          feel:"الحالة",
          googlemap: "رابط جوجل ماب",
          From_zone: "من المنطقة",
          To_zone: "إلى المنطقة",
          EventBenefits: "فوائد الفعالية",
          statue: "الحالة",
          Date_Time: "التاريخ والوقت",
          image: "الصورة",
          Zone: "المنطقة",
          Requirements: "المتطلبات",
          place: "المكان",
          inactive: "غير نشط",
          active: "نشط",
          Event: "الفعالية",
          end: "نهاية (الوقت)",
          benfitAndrequirment: "الفائدة والمتطلبات",
          organizers: "المنظمين",
          description: "الوصف",
          volunteers: "المتطوعين",
          NetworkFailed: "فشل في الاتصال",
          start: "بداية (الوقت)",
          EventAdded:"تم إضافة الفعالية بنجاح",
          EditEvent: "تعديل الفعالية",
          AddEvent: "إضافة فعالية", 
          EventUpdated:"تم تحديث الفعالية بنجاح",
          data: "المعياد",
          UserUpdated:"تم تحديث المستخدم بنجاح",
          UserAdded:"تم إضافة المستخدم بنجاح",
          UserDeleted:"تم حذف المستخدم بنجاح",
          Information: "المعلومات",
          Total_hours: "إجمالي الساعات",
          Organiztion: "المنظمة",
          Personal: "معلومات شخصية ",
          Gender: "  الجنس ",
          Users: "المستخدمين ",
          Filter: "فلتر",
          User: "المستخدم",
          Email: "البريد الإلكتروني",
          Phone: "رقم الهاتف",
          Country: "الدولة",
          City: "المدينة",
          Status: "الحالة",
          Search: "بحث",
          Events: "الفعاليات",
          Tasks: "المهام",
          Requests: "الطلبات",
          EditUser: "تعديل المستخدم",
          AddUser: "إضافة مستخدم",
          Select_date: "اختر التاريخ",
          Birthdate: "تاريخ الميلاد",
          Password: "كلمة المرور",
          Done: "تم",
          Complaint: "شكوى",
          Suggest: "اقتراح",
          Back : "الهوية الخلفية",
          Front : "الهوية الأمامية",
          Selfie : "صورة سيلفي",
          Paper: "ورقة المنظمة",
          Name: "الاسم",
          date: "التاريخ",
          Organization: "المنظمة",
          Total : "إجمالي الساعات",
          time: "الوقت",
          location: "الموقع",
        },
      },
    },
  }, () => {
    console.log('i18n تم تهيئته باللغة:', i18n.language); // تسجيل اللغة بعد التهيئة
  });

export default i18n;