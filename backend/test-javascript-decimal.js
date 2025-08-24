console.log('=== TEST JAVASCRIPT DECIMAL HANDLING ===\n');

// Test 1: Kiểm tra cách JavaScript xử lý số thập phân
console.log('1. Test cách JavaScript xử lý số thập phân...');

const testNumbers = [3.5, 2.75, 1.25, 0.5, -3.5, -2.75];

for (const num of testNumbers) {
  console.log(`Number: ${num}, Type: ${typeof num}`);
}

// Test 2: Test phép tính
console.log('\n2. Test phép tính...');

for (const num of testNumbers) {
  const addNum = 1.5;
  const result = num + addNum;
  console.log(`${num} + ${addNum} = ${result} (Type: ${typeof result})`);
}

// Test 3: Test với || 0
console.log('\n3. Test với || 0...');

for (const num of testNumbers) {
  const result1 = num || 0;
  const result2 = parseFloat(num) || 0;
  const result3 = Number(num) || 0;
  
  console.log(`Number: ${num}`);
  console.log(`  num || 0: ${result1} (Type: ${typeof result1})`);
  console.log(`  parseFloat(num) || 0: ${result2} (Type: ${typeof result2})`);
  console.log(`  Number(num) || 0: ${result3} (Type: ${typeof result3})`);
}

// Test 4: Test với null và undefined
console.log('\n4. Test với null và undefined...');

const nullValues = [null, undefined, 0, false, ''];

for (const val of nullValues) {
  const result1 = val || 0;
  const result2 = parseFloat(val) || 0;
  const result3 = Number(val) || 0;
  
  console.log(`Value: ${val} (Type: ${typeof val})`);
  console.log(`  val || 0: ${result1} (Type: ${typeof result1})`);
  console.log(`  parseFloat(val) || 0: ${result2} (Type: ${typeof result2})`);
  console.log(`  Number(val) || 0: ${result3} (Type: ${typeof result3})`);
}

// Test 5: Test với string numbers
console.log('\n5. Test với string numbers...');

const stringNumbers = ['3.5', '2.75', '1.25', '0.5', '-3.5', '-2.75'];

for (const str of stringNumbers) {
  const result1 = str || 0;
  const result2 = parseFloat(str) || 0;
  const result3 = Number(str) || 0;
  
  console.log(`String: "${str}" (Type: ${typeof str})`);
  console.log(`  str || 0: ${result1} (Type: ${typeof result1})`);
  console.log(`  parseFloat(str) || 0: ${result2} (Type: ${typeof result2})`);
  console.log(`  Number(str) || 0: ${result3} (Type: ${typeof result3})`);
}

// Test 6: Test phép tính với string numbers
console.log('\n6. Test phép tính với string numbers...');

for (const str of stringNumbers) {
  const num = parseFloat(str);
  const addNum = 1.5;
  const result = num + addNum;
  
  console.log(`"${str}" (${num}) + ${addNum} = ${result} (Type: ${typeof result})`);
}

// Test 7: Test với database-like values
console.log('\n7. Test với database-like values...');

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
const money1 = dbTransaction.so_tien || 0;
const money2 = parseFloat(dbTransaction.so_tien) || 0;
const money3 = Number(dbTransaction.so_tien) || 0;

const points1 = dbTransaction.diem || 0;
const points2 = parseFloat(dbTransaction.diem) || 0;
const points3 = Number(dbTransaction.diem) || 0;

console.log('\nXử lý so_tien:');
console.log('  so_tien || 0:', money1, '(Type:', typeof money1, ')');
console.log('  parseFloat(so_tien) || 0:', money2, '(Type:', typeof money2, ')');
console.log('  Number(so_tien) || 0:', money3, '(Type:', typeof money3, ')');

console.log('\nXử lý diem:');
console.log('  diem || 0:', points1, '(Type:', typeof points1, ')');
console.log('  parseFloat(diem) || 0:', points2, '(Type:', typeof points2, ')');
console.log('  Number(diem) || 0:', points3, '(Type:', typeof points3, ')');

// Test phép tính
console.log('\nTest phép tính:');
const addMoney = 50000.25;
const addPoints = 1.5;

console.log('Tiền:', money1, '+', addMoney, '=', money1 + addMoney);
console.log('Điểm:', points1, '+', addPoints, '=', points1 + addPoints);

console.log('\nVới parseFloat:');
console.log('Tiền:', money2, '+', addMoney, '=', money2 + addMoney);
console.log('Điểm:', points2, '+', addPoints, '=', points2 + addPoints);

// Test 8: Test với giá trị thực tế từ database
console.log('\n8. Test với giá trị thực tế từ database...');

// Mô phỏng dữ liệu thực tế
const realTransaction = {
  id: 144,
  so_tien: '2000000.00',
  diem: '3.50'
};

console.log('Real transaction:');
console.log('  so_tien:', realTransaction.so_tien, '(Type:', typeof realTransaction.so_tien, ')');
console.log('  diem:', realTransaction.diem, '(Type:', typeof realTransaction.diem, ')');

// Test xử lý
const realMoney = parseFloat(realTransaction.so_tien) || 0;
const realPoints = parseFloat(realTransaction.diem) || 0;

console.log('\nSau khi xử lý:');
console.log('  so_tien:', realMoney, '(Type:', typeof realMoney, ')');
console.log('  diem:', realPoints, '(Type:', typeof realPoints, ')');

// Test phép tính
const newMoney = realMoney + 100000;
const newPoints = realPoints + 2.5;

console.log('\nPhép tính:');
console.log('  Tiền mới:', realMoney, '+ 100000 =', newMoney);
console.log('  Điểm mới:', realPoints, '+ 2.5 =', newPoints);

console.log('\n=== KẾT LUẬN ===');
console.log('✅ parseFloat() giữ nguyên số thập phân');
console.log('✅ Number() giữ nguyên số thập phân');
console.log('❌ || 0 có thể gây ra vấn đề với string numbers');
console.log('💡 Nên sử dụng parseFloat() hoặc Number() để xử lý số từ database');
