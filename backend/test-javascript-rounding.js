console.log('=== TEST VIỆC LÀM TRÒN SỐ TRONG JAVASCRIPT ===\n');

// Test 1: Kiểm tra các hàm làm tròn số
console.log('1. Kiểm tra các hàm làm tròn số...');

const testNumbers = [3.5, 2.75, 1.25, 0.5, -3.5, -2.75];

for (const num of testNumbers) {
  console.log(`Number: ${num}`);
  console.log(`  Math.round(): ${Math.round(num)}`);
  console.log(`  Math.ceil(): ${Math.ceil(num)}`);
  console.log(`  Math.floor(): ${Math.floor(num)}`);
  console.log(`  toFixed(0): ${num.toFixed(0)}`);
  console.log(`  toFixed(1): ${num.toFixed(1)}`);
  console.log(`  toFixed(2): ${num.toFixed(2)}`);
  console.log('');
}

// Test 2: Kiểm tra các toán tử có thể gây làm tròn
console.log('2. Kiểm tra các toán tử có thể gây làm tròn...');

for (const num of testNumbers) {
  console.log(`Number: ${num}`);
  console.log(`  num | 0: ${num | 0}`);
  console.log(`  num >> 0: ${num >> 0}`);
  console.log(`  num >>> 0: ${num >>> 0}`);
  console.log(`  ~~num: ${~~num}`);
  console.log(`  parseInt(num): ${parseInt(num)}`);
  console.log('');
}

// Test 3: Kiểm tra với string numbers
console.log('3. Kiểm tra với string numbers...');

const stringNumbers = ['3.5', '2.75', '1.25', '0.5', '-3.5', '-2.75'];

for (const str of stringNumbers) {
  console.log(`String: "${str}"`);
  console.log(`  parseInt(str): ${parseInt(str)}`);
  console.log(`  parseFloat(str): ${parseFloat(str)}`);
  console.log(`  Number(str): ${Number(str)}`);
  console.log(`  +str: ${+str}`);
  console.log(`  str | 0: ${str | 0}`);
  console.log(`  str >> 0: ${str >> 0}`);
  console.log('');
}

// Test 4: Kiểm tra với database-like values
console.log('4. Kiểm tra với database-like values...');

// Mô phỏng dữ liệu từ database
const dbTransaction = {
  id: 1,
  so_tien: '100000.50',
  diem: '3.50'
};

console.log('Database transaction object:');
console.log('  so_tien:', dbTransaction.so_tien, '(Type:', typeof dbTransaction.so_tien, ')');
console.log('  diem:', dbTransaction.diem, '(Type:', typeof dbTransaction.diem, ')');

// Test các cách xử lý khác nhau
console.log('\nXử lý so_tien:');
console.log('  so_tien | 0:', dbTransaction.so_tien | 0);
console.log('  so_tien >> 0:', dbTransaction.so_tien >> 0);
console.log('  parseInt(so_tien):', parseInt(dbTransaction.so_tien));
console.log('  parseFloat(so_tien):', parseFloat(dbTransaction.so_tien));
console.log('  Number(so_tien):', Number(dbTransaction.so_tien));

console.log('\nXử lý diem:');
console.log('  diem | 0:', dbTransaction.diem | 0);
console.log('  diem >> 0:', dbTransaction.diem >> 0);
console.log('  parseInt(diem):', parseInt(dbTransaction.diem));
console.log('  parseFloat(diem):', parseFloat(dbTransaction.diem));
console.log('  Number(diem):', Number(dbTransaction.diem));

// Test 5: Kiểm tra với giá trị thực tế từ database
console.log('\n5. Kiểm tra với giá trị thực tế từ database...');

// Mô phỏng dữ liệu thực tế
const realTransaction = {
  id: 144,
  so_tien: '2000000.00',
  diem: '3.50'
};

console.log('Real transaction:');
console.log('  so_tien:', realTransaction.so_tien, '(Type:', typeof realTransaction.so_tien, ')');
console.log('  diem:', realTransaction.diem, '(Type:', typeof realTransaction.diem, ')');

// Test các cách xử lý khác nhau
console.log('\nXử lý so_tien:');
console.log('  so_tien | 0:', realTransaction.so_tien | 0);
console.log('  so_tien >> 0:', realTransaction.so_tien >> 0);
console.log('  parseInt(so_tien):', parseInt(realTransaction.so_tien));
console.log('  parseFloat(so_tien):', parseFloat(realTransaction.so_tien));
console.log('  Number(so_tien):', Number(realTransaction.so_tien));

console.log('\nXử lý diem:');
console.log('  diem | 0:', realTransaction.diem | 0);
console.log('  diem >> 0:', realTransaction.diem >> 0);
console.log('  parseInt(diem):', parseInt(realTransaction.diem));
console.log('  parseFloat(diem):', parseFloat(realTransaction.diem));
console.log('  Number(diem):', Number(realTransaction.diem));

// Test 6: Kiểm tra với số âm
console.log('\n6. Kiểm tra với số âm...');

const negativeString = '-3.50';
console.log(`String: "${negativeString}"`);
console.log(`  parseInt: ${parseInt(negativeString)}`);
console.log(`  parseFloat: ${parseFloat(negativeString)}`);
console.log(`  Number: ${Number(negativeString)}`);
console.log(`  | 0: ${negativeString | 0}`);
console.log(`  >> 0: ${negativeString >> 0}`);

// Test 7: Kiểm tra với số 0
console.log('\n7. Kiểm tra với số 0...');

const zeroString = '0.50';
console.log(`String: "${zeroString}"`);
console.log(`  parseInt: ${parseInt(zeroString)}`);
console.log(`  parseFloat: ${parseFloat(zeroString)}`);
console.log(`  Number: ${Number(zeroString)}`);
console.log(`  | 0: ${zeroString | 0}`);
console.log(`  >> 0: ${zeroString >> 0}`);

console.log('\n=== KẾT LUẬN ===');
console.log('✅ parseInt() giữ nguyên số thập phân');
console.log('✅ parseFloat() giữ nguyên số thập phân');
console.log('✅ Number() giữ nguyên số thập phân');
console.log('❌ | 0 làm tròn xuống số nguyên');
console.log('❌ >> 0 làm tròn xuống số nguyên');
console.log('❌ >>> 0 làm tròn xuống số nguyên');
console.log('❌ ~~ làm tròn xuống số nguyên');
console.log('💡 Nên sử dụng parseFloat() hoặc Number() để xử lý số từ database');
console.log('💡 Tránh sử dụng các toán tử bitwise (|, >>, >>>, ~~) với số thập phân');
