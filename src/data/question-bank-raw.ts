import { RawQuestion } from "@/types/question-raw";

export const rawQuestionBank: RawQuestion[] = [
  // =========================
  // BÀI 2. PHẢN ỨNG HÓA HỌC
  // =========================
  {
    id: "b2-nb-1",
    lessonId: "lesson-2",
    level: "nhanbiet",
    question: "Trong các quá trình sau, quá trình nào xảy ra biến đổi vật lí?",
    options: [
      "Nước hồ bị bốc hơi khi trời nắng",
      "Diêm bị cháy khi quẹt vào vỏ hộp diêm",
      "Thịt bị cháy khi nướng",
      "Pháo hoa cháy tỏa sáng"
    ],
    correctAnswer: "Nước hồ bị bốc hơi khi trời nắng",
    explanation: "Bốc hơi chỉ làm thay đổi trạng thái, không tạo ra chất mới."
  },
  {
    id: "b2-nb-2",
    lessonId: "lesson-2",
    level: "nhanbiet",
    question: "Trong các quá trình sau, quá trình nào xảy ra biến đổi vật lí?",
    options: [
      "Đường cháy thành than",
      "Cơm để lâu bị ôi thiu",
      "Sữa chua lên men",
      "Nước đông đá ở 0°C"
    ],
    correctAnswer: "Nước đông đá ở 0°C",
    explanation: "Đông đá chỉ là sự thay đổi trạng thái của nước."
  },
  {
    id: "b2-nb-3",
    lessonId: "lesson-2",
    level: "nhanbiet",
    question: "Hiện tượng hoá học khác với biến đổi vật lí ở điểm nào?",
    options: [
      "Chỉ biến đổi về trạng thái",
      "Có sinh ra chất mới",
      "Biến đổi về hình dạng",
      "Khối lượng thay đổi"
    ],
    correctAnswer: "Có sinh ra chất mới",
    explanation: "Biến đổi hóa học luôn tạo ra chất mới."
  },
  {
    id: "b2-th-1",
    lessonId: "lesson-2",
    level: "thonghieu",
    question: "Trước và sau phản ứng hóa học, yếu tố nào thay đổi?",
    options: [
      "Khối lượng các nguyên tử",
      "Số lượng các nguyên tử",
      "Liên kết giữa các nguyên tử",
      "Thành phần các nguyên tố"
    ],
    correctAnswer: "Liên kết giữa các nguyên tử",
    explanation: "Trong phản ứng hóa học, liên kết thay đổi để tạo thành chất mới."
  },
  {
    id: "b2-th-2",
    lessonId: "lesson-2",
    level: "thonghieu",
    question: "Dấu hiệu nào sau đây không chứng tỏ đã có phản ứng hoá học xảy ra?",
    options: [
      "Thay đổi màu sắc",
      "Xuất hiện chất kết tủa",
      "Tỏa nhiệt và phát sáng",
      "Tan chảy ở nhiệt độ cao"
    ],
    correctAnswer: "Tan chảy ở nhiệt độ cao",
    explanation: "Tan chảy thường là biến đổi vật lí, chưa chắc có chất mới tạo thành."
  },
  {
    id: "b2-th-3",
    lessonId: "lesson-2",
    level: "thonghieu",
    question: "Phản ứng nào sau đây là phản ứng tỏa nhiệt?",
    options: [
      "Phản ứng nung đá vôi CaCO3",
      "Phản ứng đốt cháy khí gas",
      "Phản ứng hòa tan viên C sủi vào nước",
      "Phản ứng phân hủy đường"
    ],
    correctAnswer: "Phản ứng đốt cháy khí gas",
    explanation: "Phản ứng đốt cháy giải phóng nhiệt ra môi trường."
  },
  {
    id: "b2-vd-1",
    lessonId: "lesson-2",
    level: "vandung",
    question:
      "Cho các quá trình: (1) hòa tan muối ăn vào nước, (2) cồn bay hơi, (3) nước đóng băng, (4) cho CaO tác dụng với nước. Những quá trình là biến đổi vật lí là:",
    options: [
      "(1), (2), (3)",
      "(1), (2), (4)",
      "(2), (3), (4)",
      "(1), (3), (4)"
    ],
    correctAnswer: "(1), (2), (3)",
    explanation: "Ba quá trình đầu không tạo chất mới, còn CaO + H2O tạo ra Ca(OH)2."
  },
  {
    id: "b2-vd-2",
    lessonId: "lesson-2",
    level: "vandung",
    question:
      "Cho các quá trình: (1) thức ăn để qua đêm bị ôi thiu, (2) đun đường chuyển màu đen, (3) bóng bay nổ, (4) cháy rừng, (5) băng tan ở hai cực. Những quá trình xảy ra biến đổi hóa học là:",
    options: [
      "(2), (3), (4)",
      "(1), (2), (5)",
      "(1), (2), (4)",
      "(1), (4), (5)"
    ],
    correctAnswer: "(1), (2), (4)",
    explanation: "Ôi thiu, cháy và đường bị phân hủy đều tạo ra chất mới."
  },

  // =========================
  // BÀI 3. MOL VÀ TỈ KHỐI CHẤT KHÍ
  // =========================
  {
    id: "b3-nb-1",
    lessonId: "lesson-3",
    level: "nhanbiet",
    question: "Số Avogadro có giá trị là:",
    options: ["6,022×10^22", "6,022×10^23", "6,022×10^24", "6,022×10^25"],
    correctAnswer: "6,022×10^23",
    explanation: "Một mol chứa 6,022×10^23 hạt vi mô."
  },
  {
    id: "b3-nb-2",
    lessonId: "lesson-3",
    level: "nhanbiet",
    question: "Ở điều kiện chuẩn, 1 mol của bất kì chất khí nào đều chiếm thể tích là:",
    options: ["27,49 L", "24,79 L", "24,2 L", "22,4 L"],
    correctAnswer: "24,79 L",
    explanation: "Theo tài liệu của bạn, ở điều kiện chuẩn 1 mol khí chiếm 24,79 lít."
  },
  {
    id: "b3-nb-3",
    lessonId: "lesson-3",
    level: "nhanbiet",
    question: "Khí nào nặng nhất trong các khí sau?",
    options: ["CH4", "CO2", "N2", "H2"],
    correctAnswer: "CO2",
    explanation: "CO2 có phân tử khối lớn nhất trong các lựa chọn."
  },
  {
    id: "b3-th-1",
    lessonId: "lesson-3",
    level: "thonghieu",
    question: "Trong 1 mol H2O có chứa bao nhiêu nguyên tử hydrogen?",
    options: ["3,055×10^6", "9,033×10^23", "12,044×10^23", "6,022×10^23"],
    correctAnswer: "12,044×10^23",
    explanation: "Mỗi phân tử H2O có 2 nguyên tử H, nên 1 mol H2O có 2 mol nguyên tử H."
  },
  {
    id: "b3-th-2",
    lessonId: "lesson-3",
    level: "thonghieu",
    question: "Ở cùng điều kiện nhiệt độ và áp suất, nếu hai chất khí có thể tích bằng nhau thì chúng:",
    options: [
      "Cùng khối lượng",
      "Cùng số mol",
      "Cùng tính chất hóa học",
      "Cùng tính chất vật lí"
    ],
    correctAnswer: "Cùng số mol",
    explanation: "Theo định luật Avogadro, cùng điều kiện thì cùng thể tích khí chứa cùng số mol."
  },
  {
    id: "b3-th-3",
    lessonId: "lesson-3",
    level: "thonghieu",
    question: "Khí nào sau đây nhẹ hơn không khí?",
    options: ["NH3", "CO2", "N2O", "H2S"],
    correctAnswer: "NH3",
    explanation: "NH3 có khối lượng mol nhỏ hơn khối lượng mol trung bình của không khí."
  },
  {
    id: "b3-vd-1",
    lessonId: "lesson-3",
    level: "vandung",
    question: "Tỉ khối của khí X đối với khí hydrogen bằng 16. Khí X có khối lượng mol là:",
    options: ["16 gam", "32 gam", "64 gam", "8 gam"],
    correctAnswer: "32 gam",
    explanation: "d(X/H2) = MX / 2 = 16 => MX = 32 g/mol."
  },
  {
    id: "b3-vd-2",
    lessonId: "lesson-3",
    level: "vandung",
    question:
      "Một hỗn hợp khí gồm 0,1 mol O2; 0,25 mol N2 và 0,15 mol CO. Khối lượng mol trung bình của hỗn hợp là:",
    options: ["26,4 g/mol", "27,5 g/mol", "28,8 g/mol", "28,2 g/mol"],
    correctAnswer: "28,2 g/mol",
    explanation: "Tính khối lượng từng khí rồi chia cho tổng số mol."
  },

  // =========================
  // BÀI 4. NỒNG ĐỘ DUNG DỊCH
  // =========================
  {
    id: "b4-nb-1",
    lessonId: "lesson-4",
    level: "nhanbiet",
    question: "Dung dịch là hỗn hợp:",
    options: [
      "của chất rắn trong chất lỏng",
      "đồng nhất của dung môi và chất tan",
      "của chất khí trong chất lỏng",
      "đồng nhất của hai chất rắn"
    ],
    correctAnswer: "đồng nhất của dung môi và chất tan",
    explanation: "Dung dịch gồm dung môi và chất tan hòa lẫn đồng nhất."
  },
  {
    id: "b4-nb-2",
    lessonId: "lesson-4",
    level: "nhanbiet",
    question: "Nồng độ phần trăm là nồng độ cho biết:",
    options: [
      "số gam chất tan có trong 100 gam dung dịch",
      "số gam chất tan có trong 100 gam nước",
      "số mol chất tan có trong 1 lít dung dịch",
      "số mol chất tan có trong 100 gam dung dịch"
    ],
    correctAnswer: "số gam chất tan có trong 100 gam dung dịch",
    explanation: "C% cho biết số gam chất tan trong 100 gam dung dịch."
  },
  {
    id: "b4-nb-3",
    lessonId: "lesson-4",
    level: "nhanbiet",
    question: "Nồng độ mol/L của dung dịch là:",
    options: [
      "số gam chất tan trong 1 lít dung dịch",
      "số gam chất tan trong 1 lít dung môi",
      "số mol chất tan trong 1 lít dung dịch",
      "số mol chất tan trong 1 lít dung môi"
    ],
    correctAnswer: "số mol chất tan trong 1 lít dung dịch",
    explanation: "CM là số mol chất tan trong 1 lít dung dịch."
  },
  {
    id: "b4-th-1",
    lessonId: "lesson-4",
    level: "thonghieu",
    question: "Khi tăng nhiệt độ thì độ tan của các chất rắn trong nước:",
    options: ["đều tăng", "đều giảm", "phần lớn là tăng", "phần lớn là giảm"],
    correctAnswer: "phần lớn là tăng",
    explanation: "Độ tan của đa số chất rắn tăng khi nhiệt độ tăng."
  },
  {
    id: "b4-th-2",
    lessonId: "lesson-4",
    level: "thonghieu",
    question: "Hòa tan 50 gam NaCl vào 450 gam nước thì dung dịch thu được có nồng độ là:",
    options: ["15%", "20%", "10%", "5%"],
    correctAnswer: "10%",
    explanation: "C% = 50 / (50 + 450) × 100 = 10%."
  },
  {
    id: "b4-th-3",
    lessonId: "lesson-4",
    level: "thonghieu",
    question: "Muốn pha 400 mL dung dịch CuSO4 0,2M thì số mol chất tan cần là:",
    options: ["0,08 mol", "0,2 mol", "0,4 mol", "0,02 mol"],
    correctAnswer: "0,08 mol",
    explanation: "n = C × V = 0,2 × 0,4 = 0,08 mol."
  },
  {
    id: "b4-vd-1",
    lessonId: "lesson-4",
    level: "vandung",
    question:
      "Hoà tan 4 gam NaOH vào nước để được 400 mL dung dịch. Nồng độ mol của dung dịch thu được là:",
    options: ["0,22M", "0,23M", "0,24M", "0,25M"],
    correctAnswer: "0,25M",
    explanation: "n = 4/40 = 0,1 mol; CM = 0,1/0,4 = 0,25M."
  },
  {
    id: "b4-vd-2",
    lessonId: "lesson-4",
    level: "vandung",
    question:
      "Muốn pha 100 mL dung dịch H2SO4 3M thì số mol H2SO4 cần lấy là:",
    options: ["0,3 mol", "3 mol", "0,03 mol", "0,1 mol"],
    correctAnswer: "0,3 mol",
    explanation: "n = C × V = 3 × 0,1 = 0,3 mol."
  },

  // =========================
  // BÀI 5. ĐỊNH LUẬT BẢO TOÀN KHỐI LƯỢNG - PTHH
  // =========================
  {
    id: "b5-nb-1",
    lessonId: "lesson-5",
    level: "nhanbiet",
    question: "Cho phản ứng: A + B → C + D. Phương trình bảo toàn khối lượng là:",
    options: [
      "mA = mB + mC + mD",
      "mA + mB = mC + mD",
      "mB = mA + mC + mD",
      "mD = mA + mB + mC"
    ],
    correctAnswer: "mA + mB = mC + mD",
    explanation: "Tổng khối lượng chất phản ứng bằng tổng khối lượng sản phẩm."
  },
  {
    id: "b5-nb-2",
    lessonId: "lesson-5",
    level: "nhanbiet",
    question: "Khối lượng trước và sau một phản ứng hóa học được bảo toàn vì:",
    options: [
      "số lượng các chất không thay đổi",
      "số lượng nguyên tử không thay đổi",
      "liên kết giữa các nguyên tử không đổi",
      "không có tạo thành chất mới"
    ],
    correctAnswer: "số lượng nguyên tử không thay đổi",
    explanation: "Trong phản ứng hóa học, số nguyên tử mỗi nguyên tố được bảo toàn."
  },
  {
    id: "b5-nb-3",
    lessonId: "lesson-5",
    level: "nhanbiet",
    question: "Phương trình hóa học là:",
    options: [
      "cách viết tên các chất tham gia",
      "cách biểu diễn phản ứng hóa học bằng công thức hóa học",
      "cách mô tả hiện tượng vật lí",
      "cách ghi số mol của các chất"
    ],
    correctAnswer: "cách biểu diễn phản ứng hóa học bằng công thức hóa học",
    explanation: "PTHH dùng công thức hóa học và hệ số để biểu diễn phản ứng."
  },
  {
    id: "b5-th-1",
    lessonId: "lesson-5",
    level: "thonghieu",
    question: "Trong một phản ứng hoá học, các chất phản ứng và chất tạo thành có cùng:",
    options: [
      "số nguyên tử của mỗi nguyên tố",
      "số nguyên tử trong mỗi chất",
      "số phân tử trong mỗi chất",
      "số nguyên tố tạo ra chất"
    ],
    correctAnswer: "số nguyên tử của mỗi nguyên tố",
    explanation: "Phản ứng hóa học không làm mất hay tạo thêm nguyên tử."
  },
  {
    id: "b5-th-2",
    lessonId: "lesson-5",
    level: "thonghieu",
    question: "Khi cân bằng phương trình hóa học, điều nào sau đây là đúng?",
    options: [
      "Được thay đổi chỉ số trong công thức hóa học",
      "Chỉ được thay đổi hệ số đứng trước công thức",
      "Được thay đổi cả chỉ số và hệ số",
      "Không cần cân bằng số nguyên tử"
    ],
    correctAnswer: "Chỉ được thay đổi hệ số đứng trước công thức",
    explanation: "Không được thay đổi chỉ số trong công thức hóa học đã đúng."
  },
  {
    id: "b5-th-3",
    lessonId: "lesson-5",
    level: "thonghieu",
    question: "Cứ 4 mol sắt phản ứng với 3 mol oxygen. Phương trình nào đúng?",
    options: [
      "Fe2 + O3 → Fe2O3",
      "2Fe2 + 3O2 → 2Fe2O3",
      "4Fe + 3O2 → 2Fe2O3",
      "Fe2 + 3O → Fe2O3"
    ],
    correctAnswer: "4Fe + 3O2 → 2Fe2O3",
    explanation: "Tỉ lệ mol 4 : 3 phù hợp với phương trình đã cân bằng."
  },
  {
    id: "b5-vd-1",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Than cháy tạo ra khí carbon dioxide. Biết khối lượng carbon đã cháy là 4,5 kg và khối lượng oxygen đã phản ứng là 12 kg. Khối lượng CO2 tạo ra là:",
    options: ["16,2 kg", "16,3 kg", "16,4 kg", "16,5 kg"],
    correctAnswer: "16,5 kg",
    explanation: "Theo định luật bảo toàn khối lượng: 4,5 + 12 = 16,5 kg."
  },
  {
    id: "b5-vd-2",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Một chiếc đinh sắt để lâu ngày ngoài không khí thì bị gỉ. Khối lượng của đinh sắt so với ban đầu sẽ:",
    options: ["Tăng", "Giảm", "Không thay đổi", "Không thể biết"],
    correctAnswer: "Tăng",
    explanation: "Sắt kết hợp với oxygen trong không khí tạo gỉ nên khối lượng tăng."
  },
  {
    id: "b5-vd-3",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Khi đốt cháy hoàn toàn 1 mol metan (CH4) trong oxi, sản phẩm tạo thành là:",
    options: ["1 mol CO2 và 2 mol H2O", "1 mol CO2 và 4 mol H2O", "2 mol CO2 và 2 mol H2O", "2 mol CO2 và 4 mol H2O"],
    correctAnswer: "1 mol CO2 và 2 mol H2O",
    explanation: "Phương trình phản ứng: CH4 + 2O2 → CO2 + 2H2O"
  },
  {
    id: "b5-vd-4",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Khi 2 mol khí hidro (H2) phản ứng với 1 mol khí oxy (O2) để tạo thành nước (H2O), khối lượng nước tạo thành là:",
    options: ["18 gam", "36 gam", "9 gam", "27 gam"],
    correctAnswer: "18 gam",
    explanation: "Phương trình phản ứng: 2H2 + O2 → 2H2O. Khối lượng mol của H2O là 18 g/mol."
  },
  {
    id: "b5-vd-5",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Khi 1 mol khí metan (CH4) phản ứng với 2 mol khí oxy (O2) để tạo thành carbon dioxide (CO2) và nước (H2O), khối lượng sản phẩm tạo thành là:",
    options: ["44 gam", "36 gam", "80 gam", "58 gam"],
    correctAnswer: "80 gam",
    explanation: "Phương trình phản ứng: CH4 + 2O2 → CO2 + 2H2O. Khối lượng mol của CO2 là 44 g/mol và H2O là 18 g/mol."
  },
  {
    id: "b5-vd-6",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Khi 1 mol khí hidro (H2) phản ứng với 1 mol khí oxy (O2) để tạo thành nước (H2O), khối lượng sản phẩm tạo thành là:",
    options: ["18 gam", "36 gam", "9 gam", "27 gam"],
    correctAnswer: "18 gam",
    explanation: "Phương trình phản ứng: 2H2 + O2 → 2H2O. Khối lượng mol của H2O là 18 g/mol."
  },
  {
    id: "b5-vd-7",
    lessonId: "lesson-5",
    level: "vandung",
    question:
      "Khi 1 mol khí metan (CH4) phản ứng với 2 mol khí oxy (O2) để tạo thành carbon dioxide (CO2) và nước (H2O), khối lượng sản phẩm tạo thành là:",
    options: ["44 gam", "36 gam", "80 gam", "58 gam"],
    correctAnswer: "80 gam",
    explanation: "Phương trình phản ứng: CH4 + 2O2 → CO2 + 2H2O. Khối lượng mol của CO2 là 44 g/mol và H2O là 18 g/mol."
  }
];