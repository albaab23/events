const supabaseurl = 'https://ohtmcodctiyawsgdrjuy.supabase.co'
const supabasekey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odG1jb2RjdGl5YXdzZ2RyanV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDg3ODcsImV4cCI6MjEwNzM4NDc4N30.ksKD6trl2YUUAfuuoMC3yyqPJhvzLvaCGM1n9BB_2NA'
const _supabase = window.supabase.createClient(supabaseurl, supabasekey)
document.getElementById('role').addEventListener('change', function (){
    document.getElementById('racer').style.display = this.value === 'متسابق' ? "block" : 'none'
    document.getElementById('viewer').style.display = this.value === 'مشاهد' ? "block" : 'none'
})
async function uploadCert(file) {
    const ext = file.name.split('.').pop();
    const fileName = `cert-${crypto.randomUUID()}.${ext}`;
  
    const { error } = await _supabase
      .storage
      .from('images')
      .upload(fileName, file);
  
    if (error) {
      console.error('خطأ الرفع:', error);
      throw error;
    }
  
    return fileName;
  }
  
selectmethod = 'كاش'
function cashviewer() {
    selectmethod = 'كاش'
    let text = document.getElementById('text-viewer')
    text.innerHTML = 'تم اختيار الدفع كاش <span style="color:green;">&#10004;</span>';
}
function shamcashviewer() {
    selectmethod = 'شام كاش'
    let text = document.getElementById('text-viewer')
    text.innerHTML = ''
}
function cashracer() {
    selectmethod = 'كاش';
    let text = document.getElementById('text-racer');
    text.innerHTML = 'تم اختيار الدفع كاش <span style="color:green;">&#10004;</span>';
}

function shamcashracer() {
    selectmethod = 'شام كاش';
    let text = document.getElementById('text-racer');
    text.innerHTML = '';
}
let verficationcoderacer = ''
let verficationcodeviewer = ''
function confirmcode(type) {
    const inputId = 'code-' + type;
    const code = document.getElementById(inputId).value.trim();
    if (!code) {
      alert('اكتب رمز التحقق');
      return;
    }
    if (type === 'viewer') {
      verficationcodeviewer = code;
    } else {
      verficationcoderacer = code;
    }
    document.getElementById('sham-' + type).hidePopover();
    document.getElementById('text-' + type).innerHTML = 
      'تم اختيار الدفع شام كاش ✅';
    selectmethod = 'شام كاش';
  }

async function senddata() {
    const role = document.getElementById('role').value;
    let id = crypto.randomUUID()
    let requests = {}
    if (role === 'متسابق') {
        const name = document.getElementById('name').value.trim();
        const secondName = document.getElementById('second-name').value.trim();
        const age = document.getElementById('age').value.trim();
        const carType = document.getElementById('type').value.trim();
        const carStyle = document.getElementById('style').value.trim();
        const certf = document.getElementById('certf').files[0];
        if (!name || !secondName || !age || !carType || !carStyle || !certf) {
            alert('يرجى تعبئة جميع الحقول');
            return false;
        }
        requests = {
            first_name: name,
            second_name: secondName,
            age: age,
            type: carType,
            style: carStyle,
            status: "قيد الانتظار",
            service_type: "متسابق",
            unique_id: id,
            selected_method: selectmethod,
            verification_code: verficationcoderacer
        }
        const file = document.getElementById('certf').files[0];
  if (!file) {
    alert('ارفق صورة شهادة القيادة');
    return;
  }

  try {
    const path = await uploadCert(file);
    requests.certf_path = path;
  } catch (err) {
    alert('فشل رفع الصورة');
    return;
  }
} 
    if (role === 'مشاهد') {
        const viewerName = document.getElementById('viewer-name').value.trim();
        const viewerSecondName = document.getElementById('viewer-second-name').value.trim();
        if (!viewerName || !viewerSecondName) {
            alert('يرجى تعبئة جميع الحقول');
            return false;
        }
        requests = {
            first_name: viewerName,
            second_name: viewerSecondName,
             status: "قيد الانتظار",
             service_type: "مشاهد",
             unique_id: id,
             selected_method: selectmethod,
             verification_code: verficationcodeviewer
         }

    }
const { data, error} = await _supabase.from('requests').insert([requests]).select()
if(error) {
    alert("حدث خطا")
    return
}
let ids = JSON.parse(localStorage.getItem('myrequests')) || []
ids.push(id)
localStorage.setItem('myrequests', JSON.stringify(ids))
alert('تم الارسال')
window.location.href = 'myrequests.html'
}
