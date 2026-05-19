export function buildHint(level: string) {
  if (level === "nhanbiet") {
    return "Em hãy đọc kỹ từ khóa trong câu hỏi và nhớ lại khái niệm, ký hiệu hoặc công thức nền tảng.";
  }

  if (level === "thonghieu") {
    return "Em hãy thử giải thích hiện tượng bằng lời của mình trước, sau đó mới chọn đáp án.";
  }

  if (level === "vandung") {
    return "Em cần xác định dữ kiện đề cho, đại lượng cần tìm và công thức phù hợp trước khi chọn đáp án.";
  }

  return "Bu gợi ý em đọc kỹ câu hỏi, tìm từ khóa chính rồi mới chọn đáp án.";
}

export function buildReviewNote(level: string) {
  if (level === "nhanbiet") {
    return "Nếu sai câu này, em nên xem lại phần khái niệm hoặc định nghĩa trong bài.";
  }

  if (level === "thonghieu") {
    return "Nếu sai câu này, em nên xem lại ví dụ minh họa và mindmap để hiểu bản chất.";
  }

  if (level === "vandung") {
    return "Nếu sai câu này, em nên luyện thêm dạng tương tự để quen cách áp dụng công thức.";
  }

  return "Nếu chưa chắc, em nên quay lại mindmap và lý thuyết của bài này.";
}

export function buildFormulaHint(question: string) {
  const text = question.toLowerCase();

  if (text.includes("mol") || text.includes("số mol")) {
    return "Gợi ý: n = m / M hoặc n = V / 22,4 nếu là chất khí ở đktc.";
  }

  if (text.includes("khối lượng mol")) {
    return "Gợi ý: M = m / n.";
  }

  if (text.includes("thể tích khí") || text.includes("đktc") || text.includes("22,4")) {
    return "Gợi ý: n = V / 22,4 với chất khí ở điều kiện tiêu chuẩn.";
  }

  if (text.includes("nồng độ phần trăm") || text.includes("c%")) {
    return "Gợi ý: C% = (m chất tan / m dung dịch) × 100%.";
  }

  if (text.includes("phương trình") || text.includes("pthh") || text.includes("cân bằng")) {
    return "Gợi ý: Viết PTHH → cân bằng → dùng tỉ lệ số mol.";
  }

  if (text.includes("ph")) {
    return "Gợi ý: pH < 7 là acid, pH = 7 là trung tính, pH > 7 là base.";
  }

  return "Bu chưa thấy công thức cố định. Em hãy xác định khái niệm hoặc quy tắc chính của câu hỏi.";
}

export function buildWrongReason(question: string, level?: string) {
  const text = question.toLowerCase();

  if (text.includes("mol") || text.includes("khối lượng mol")) {
    return "Em có thể đang nhầm giữa số mol, khối lượng và khối lượng mol. Hãy xác định rõ đề cho gì, hỏi gì, rồi mới chọn công thức.";
  }

  if (text.includes("thể tích khí") || text.includes("đktc") || text.includes("22,4")) {
    return "Em có thể đang quên điều kiện áp dụng công thức thể tích khí. Hãy kiểm tra đề có đang nói đến điều kiện tiêu chuẩn hay không.";
  }

  if (text.includes("phương trình") || text.includes("pthh") || text.includes("cân bằng")) {
    return "Em có thể sai ở bước lập hoặc cân bằng phương trình hóa học. Hãy kiểm tra số nguyên tử của mỗi nguyên tố ở hai vế.";
  }

  if (text.includes("phản ứng hóa học") || text.includes("dấu hiệu") || text.includes("hiện tượng")) {
    return "Em có thể chưa phân biệt rõ hiện tượng vật lí và dấu hiệu phản ứng hóa học như tạo khí, kết tủa, đổi màu hoặc tỏa nhiệt.";
  }

  if (text.includes("acid") || text.includes("axit") || text.includes("base") || text.includes("bazơ") || text.includes("ph")) {
    return "Em có thể đang nhầm tính chất acid, base hoặc ý nghĩa của thang pH.";
  }

  if (level === "nhanbiet") {
    return "Em có thể đang quên khái niệm nền. Bu gợi ý xem lại định nghĩa, ký hiệu hoặc công thức chính trước khi làm lại.";
  }

  if (level === "thonghieu") {
    return "Em có thể hiểu chưa chắc bản chất. Hãy thử tự giải thích câu hỏi bằng lời của mình rồi đối chiếu với lý thuyết.";
  }

  if (level === "vandung") {
    return "Em có thể sai ở bước chọn công thức hoặc lập luận. Hãy tách dữ kiện, xác định đại lượng cần tìm rồi mới giải.";
  }

  return "Bu gợi ý em xem lại nhánh kiến thức liên quan trong mindmap, sau đó luyện lại một bộ câu mới.";
}
import { PracticeQuestion } from "@/types/practice-final";

export function buildSmartReviewGuide(question: PracticeQuestion) {
  const text = `${question.question} ${question.lessonTitle} ${question.topic || ""}`.toLowerCase();

  if (question.formula || question.reviewNote || question.explanation) {
    return {
      guideTitle: "Hướng ôn đúng trọng tâm",
      formula:
        question.formula ||
        question.explanation ||
        "Bu gợi ý em xem lại ý chính của câu này trong bài học.",
      review:
        question.reviewNote ||
        `Em nên ôn lại phần ${question.topic || question.lessonTitle}.`,
    };
  }

  if (
    text.includes("oxide") ||
    text.includes("oxit") ||
    text.includes("oxide acid") ||
    text.includes("oxide base") ||
    text.includes("co₂") ||
    text.includes("co2")
  ) {
    return {
      guideTitle: "Ôn lại tính chất oxide",
      formula:
        "Oxide acid tác dụng với nước thường tạo acid tương ứng. Ví dụ: CO₂ + H₂O → H₂CO₃.",
      review:
        "Em nên ôn lại oxide acid, oxide base và sản phẩm tạo thành khi oxide tác dụng với nước.",
    };
  }

  if (text.includes("mol") || text.includes("khối lượng mol")) {
    return {
      guideTitle: "Ôn lại mol",
      formula: "n = m / M; với khí ở đktc: n = V / 22,4.",
      review:
        "Em nên phân biệt số mol, khối lượng và khối lượng mol trước khi làm lại.",
    };
  }

  if (text.includes("nồng độ") || text.includes("c%")) {
    return {
      guideTitle: "Ôn lại nồng độ dung dịch",
      formula: "C% = (m chất tan / m dung dịch) × 100%.",
      review:
        "Em nên ôn lại chất tan, dung môi, dung dịch và công thức nồng độ phần trăm.",
    };
  }

  if (text.includes("phản ứng hóa học")) {
    return {
      guideTitle: "Ôn lại phản ứng hóa học",
      formula:
        "Dấu hiệu phản ứng hóa học: tạo chất mới, có thể có khí, kết tủa, đổi màu hoặc tỏa nhiệt.",
      review:
        "Em nên ôn lại chất phản ứng, sản phẩm và dấu hiệu nhận biết phản ứng hóa học.",
    };
  }

  if (text.includes("ph") || text.includes("acid") || text.includes("base")) {
    return {
      guideTitle: "Ôn lại acid - base - pH",
      formula: "pH < 7 là acid, pH = 7 trung tính, pH > 7 là base.",
      review:
        "Em nên ôn lại thang pH và cách nhận biết môi trường acid, base.",
    };
  }

  return {
    guideTitle: "Ôn lại kiến thức liên quan",
    formula:
      "Bu gợi ý em xác định khái niệm chính, dữ kiện đề cho và điều cần hỏi.",
    review: `Em nên xem lại phần ${question.lessonTitle}.`,
  };
}