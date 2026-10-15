const supabaseurl = 'https://ohtmcodctiyawsgdrjuy.supabase.co'
const supabasekey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odG1jb2RjdGl5YXdzZ2RyanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDg3ODcsImV4cCI6MjEwNzM4NDc4N30.ksKD6trl2YUUAfuuoMC3yyqPJhvzLvaCGM1n9BB_2NA'
const _supabase = window.supabase.createClient(supabaseurl, supabasekey)
async function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // تحقق أن كلا الحقلين غير فارغين (اختياري لتحسين اليوزر)
    if (!email || !password) {
        alert('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
    }

    // محاولة تسجيل الدخول عن طريق Supabase
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('خطأ في البريد الإلكتروني أو كلمة المرور');
        return;
    }
    // إذا نجح تسجيل الدخول، انقل المستخدم إلى admin.html
    alert('تم تسجيل الدخول بنجاح')
    window.location.href = "admin.html";
}

// بإمكانك ربط هذه الدالة بزر تسجيل الدخول في الـ HTML مثلاً:
// <button onclick="login()">تسجيل الدخول</button>