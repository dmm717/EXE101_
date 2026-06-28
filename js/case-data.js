/* ============================================
   NEXORA - PREPARED CASE QUESTION BANK
   ============================================ */

(function () {
    'use strict';

    window.NexoraCaseLibrary = Object.freeze({
        'ekyc-onboarding': {
            id: 'ekyc-onboarding',
            title: 'Luồng onboarding khách hàng mới (eKYC)',
            category: 'Ngân hàng',
            difficulty: 'Trung bình',
            duration: '45 phút',
            description: 'Phân tích và tối ưu hóa tỷ lệ drop-off trong quá trình định danh điện tử của ứng dụng Mobile Banking.',
            questions: [
                {
                    title: 'Bạn sẽ bắt đầu phân tích luồng eKYC hiện tại như thế nào?',
                    helper: 'Mô tả các bước trong hành trình người dùng, dữ liệu cần thu thập và những bên liên quan bạn muốn trao đổi.'
                },
                {
                    title: 'Bạn sẽ xác định nguyên nhân chính gây ra tỷ lệ drop-off trong quy trình eKYC như thế nào?',
                    helper: 'Trình bày cách bạn thu thập dữ liệu, kiểm chứng giả thuyết và ưu tiên vấn đề cần xử lý.'
                },
                {
                    title: 'Đề xuất giải pháp giúp giảm tỷ lệ người dùng bỏ dở quy trình eKYC.',
                    helper: 'Cân nhắc trải nghiệm người dùng, yêu cầu tuân thủ, độ chính xác nhận diện và chi phí triển khai.'
                },
                {
                    title: 'Bạn sẽ ưu tiên các giải pháp đã đề xuất theo tiêu chí nào?',
                    helper: 'Nêu rõ phương pháp ưu tiên, giả định quan trọng và cách xử lý xung đột giữa tác động với nguồn lực.'
                },
                {
                    title: 'Bạn sẽ đo lường hiệu quả của quy trình eKYC mới ra sao?',
                    helper: 'Chọn các chỉ số chính, chỉ số cảnh báo và kế hoạch thử nghiệm trước khi triển khai rộng.'
                }
            ]
        },
        'order-crisis': {
            id: 'order-crisis',
            title: 'Xử lý khủng hoảng đơn hàng bị hủy hàng loạt',
            category: 'eCommerce',
            difficulty: 'Khó',
            duration: '60 phút',
            description: 'Hệ thống gặp lỗi trong ngày Mega Sale dẫn đến 10.000 đơn hàng bị hủy nhầm. Đề xuất phương án xử lý kỹ thuật và truyền thông.',
            questions: [
                {
                    title: 'Trong 30 phút đầu tiên, bạn cần xác minh những thông tin nào?',
                    helper: 'Xác định phạm vi ảnh hưởng, dữ liệu cần khóa và các nhóm cần tham gia xử lý sự cố.'
                },
                {
                    title: 'Bạn sẽ tổ chức thứ tự ưu tiên xử lý 10.000 đơn hàng bị hủy nhầm ra sao?',
                    helper: 'Làm rõ tiêu chí phân nhóm đơn hàng, rủi ro vận hành và quyết định cần đưa ra ngay.'
                },
                {
                    title: 'Đề xuất phương án khôi phục đơn hàng an toàn và có thể kiểm soát.',
                    helper: 'Mô tả các bước kỹ thuật, cơ chế kiểm tra chéo và kế hoạch rollback nếu phát sinh lỗi mới.'
                },
                {
                    title: 'Bạn sẽ giao tiếp với khách hàng và đối tác như thế nào trong sự cố này?',
                    helper: 'Xây dựng thông điệp, kênh liên lạc, thời điểm cập nhật và phương án bồi hoàn phù hợp.'
                },
                {
                    title: 'Sau sự cố, bạn sẽ thay đổi hệ thống và quy trình nào để tránh lặp lại?',
                    helper: 'Đề xuất chỉ số giám sát, kiểm soát phát hành và các hành động trong buổi post-mortem.'
                }
            ]
        },
        'ride-matching': {
            id: 'ride-matching',
            title: 'Tối ưu hóa thuật toán ghép cuốc xe',
            category: 'Logistics',
            difficulty: 'Trung bình',
            duration: '45 phút',
            description: 'Xây dựng logic ghép đơn hàng giao nhận trong thời gian thực để giảm thiểu tỷ lệ xe chạy rỗng.',
            questions: [
                {
                    title: 'Bạn sẽ định nghĩa bài toán ghép cuốc xe và các ràng buộc chính như thế nào?',
                    helper: 'Liệt kê mục tiêu tối ưu, dữ liệu đầu vào và những điều kiện vận hành không được vi phạm.'
                },
                {
                    title: 'Những tín hiệu nào nên được sử dụng để xếp hạng một cặp tài xế và đơn hàng?',
                    helper: 'Cân nhắc khoảng cách, thời gian chờ, năng lực xe, độ tin cậy và trải nghiệm của hai phía.'
                },
                {
                    title: 'Bạn sẽ thiết kế logic ghép cuốc theo thời gian thực ra sao?',
                    helper: 'Mô tả cách tạo ứng viên, tính điểm, chọn kết quả và xử lý khi dữ liệu thay đổi liên tục.'
                },
                {
                    title: 'Hệ thống cần xử lý những trường hợp biên nào?',
                    helper: 'Đề cập đến giờ cao điểm, hủy chuyến, mất kết nối, khu vực ít tài xế và đơn hàng quá khổ.'
                },
                {
                    title: 'Bạn sẽ thử nghiệm và đo lường thuật toán mới như thế nào?',
                    helper: 'Chọn chỉ số kinh doanh, chỉ số chất lượng, cách chạy thử và ngưỡng quyết định rollout.'
                }
            ]
        }
    });
})();
