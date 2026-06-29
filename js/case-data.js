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
                    title: 'Bạn nên bắt đầu phân tích luồng eKYC hiện tại bằng cách nào?',
                    helper: 'Chọn cách tiếp cận giúp hiểu hành trình người dùng, dữ liệu và các bên liên quan.',
                    options: [
                        'Thiết kế ngay màn hình mới để rút ngắn thời gian triển khai.',
                        'Vẽ lại journey end-to-end, thu thập funnel data và phỏng vấn các nhóm liên quan.',
                        'Chỉ xem log lỗi kỹ thuật vì drop-off luôn đến từ hệ thống.',
                        'Tăng ưu đãi mở tài khoản trước khi biết người dùng rời ở bước nào.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Cần hiểu toàn bộ journey, dữ liệu định lượng và bối cảnh vận hành trước khi kết luận nguyên nhân.'
                },
                {
                    title: 'Cách tốt nhất để xác định nguyên nhân chính gây drop-off trong eKYC là gì?',
                    helper: 'Chọn phương án giúp kiểm chứng giả thuyết và ưu tiên vấn đề.',
                    options: [
                        'So sánh tỷ lệ rời từng bước, xem replay/log lỗi và kiểm chứng bằng phỏng vấn người dùng.',
                        'Hỏi một quản lý sản phẩm rồi chọn nguyên nhân họ nghi ngờ nhất.',
                        'Giả định người dùng rời vì form dài và bỏ qua bước phân tích.',
                        'Chỉ xem tổng số người hoàn tất trong tháng gần nhất.'
                    ],
                    correctAnswer: 'A',
                    explanation: 'Phân tích theo bước kết hợp dữ liệu hành vi và insight định tính giúp tìm nguyên nhân có bằng chứng.'
                },
                {
                    title: 'Giải pháp nào phù hợp nhất để giảm drop-off nhưng vẫn giữ yêu cầu tuân thủ?',
                    helper: 'Cân nhắc trải nghiệm người dùng, độ chính xác và chi phí triển khai.',
                    options: [
                        'Bỏ bước chụp giấy tờ để người dùng hoàn tất nhanh hơn.',
                        'Cho phép tiếp tục từ bước dang dở, hướng dẫn lỗi rõ ràng và tối ưu chất lượng ảnh đầu vào.',
                        'Ẩn toàn bộ thông báo lỗi để người dùng không thấy quy trình phức tạp.',
                        'Yêu cầu tất cả người dùng ra chi nhánh để xác minh lại.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Giải pháp tốt giảm ma sát nhưng vẫn giữ kiểm soát nhận diện và tuân thủ.'
                },
                {
                    title: 'Bạn nên ưu tiên các giải pháp eKYC theo tiêu chí nào?',
                    helper: 'Chọn phương pháp cân bằng tác động và nguồn lực.',
                    options: [
                        'Ưu tiên giải pháp do đội kỹ thuật thích nhất.',
                        'Ưu tiên theo impact, effort, risk tuân thủ và mức tự tin của dữ liệu.',
                        'Làm tất cả cùng lúc để không bỏ sót ý tưởng.',
                        'Chỉ chọn giải pháp có giao diện đẹp nhất.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Impact-effort kèm rủi ro tuân thủ giúp ra quyết định thực tế và tránh tối ưu lệch.'
                },
                {
                    title: 'Bộ chỉ số nào nên dùng để đo hiệu quả quy trình eKYC mới?',
                    helper: 'Chọn nhóm chỉ số chính, chỉ số cảnh báo và kế hoạch thử nghiệm.',
                    options: [
                        'Chỉ đo số lượt tải ứng dụng.',
                        'Tỷ lệ hoàn tất eKYC, drop-off từng bước, thời gian hoàn tất, lỗi xác minh và fraud/false approve.',
                        'Chỉ đo số người nhấn nút bắt đầu eKYC.',
                        'Chỉ đo NPS sau khi người dùng đã mở tài khoản.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Cần vừa đo conversion, chất lượng vận hành, vừa theo dõi rủi ro nhận diện.'
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
                    title: 'Trong 30 phút đầu tiên, bạn cần xác minh điều gì trước?',
                    helper: 'Chọn thông tin giúp khoanh vùng sự cố và giảm thiệt hại.',
                    options: [
                        'Số lượng đơn bị ảnh hưởng, nguyên nhân kích hoạt, thời điểm lỗi và trạng thái thanh toán/tồn kho.',
                        'Mẫu banner xin lỗi khách hàng.',
                        'Danh sách nhân sự cần họp vào tuần sau.',
                        'Doanh thu cả năm của sàn.'
                    ],
                    correctAnswer: 'A',
                    explanation: 'Cần khóa phạm vi ảnh hưởng và trạng thái dữ liệu trước khi phục hồi hoặc truyền thông rộng.'
                },
                {
                    title: 'Bạn nên ưu tiên xử lý 10.000 đơn bị hủy nhầm như thế nào?',
                    helper: 'Chọn cách phân nhóm giúp vận hành an toàn.',
                    options: [
                        'Khôi phục toàn bộ đơn ngay lập tức, không cần kiểm tra.',
                        'Phân nhóm theo thanh toán, tồn kho, SLA giao hàng, giá trị đơn và mức rủi ro khi khôi phục.',
                        'Chỉ xử lý đơn của khách phàn nàn trên mạng xã hội.',
                        'Hủy vĩnh viễn để tránh phát sinh lỗi mới.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Phân nhóm giúp khôi phục có kiểm soát, tránh oversell, hoàn tiền sai hoặc vi phạm cam kết giao hàng.'
                },
                {
                    title: 'Phương án kỹ thuật nào an toàn nhất để khôi phục đơn hàng?',
                    helper: 'Chọn phương án có kiểm tra chéo và khả năng rollback.',
                    options: [
                        'Chạy script cập nhật trực tiếp production cho toàn bộ đơn.',
                        'Tạo batch khôi phục nhỏ, dry-run, đối soát tồn kho/thanh toán và có rollback plan.',
                        'Nhờ CSKH nhập tay từng đơn trong dashboard.',
                        'Tắt toàn bộ hệ thống cho đến khi hết Mega Sale.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Batch nhỏ có dry-run và đối soát giúp giảm rủi ro lan rộng khi sửa dữ liệu production.'
                },
                {
                    title: 'Cách giao tiếp phù hợp nhất với khách hàng trong sự cố này là gì?',
                    helper: 'Chọn cách truyền thông minh bạch và giảm hoang mang.',
                    options: [
                        'Im lặng cho đến khi mọi đơn đã được xử lý xong.',
                        'Thông báo rõ sự cố, phạm vi ảnh hưởng, thời gian cập nhật tiếp theo và phương án hỗ trợ/bồi hoàn.',
                        'Đổ lỗi cho đơn vị vận chuyển để giảm áp lực.',
                        'Gửi một thông báo chung không có mốc thời gian xử lý.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Minh bạch, có lịch cập nhật và phương án hỗ trợ giúp giữ niềm tin trong khủng hoảng.'
                },
                {
                    title: 'Sau sự cố, thay đổi nào quan trọng nhất để tránh lặp lại?',
                    helper: 'Chọn cải tiến hệ thống và quy trình phát hành.',
                    options: [
                        'Chỉ nhắc đội kỹ thuật cẩn thận hơn.',
                        'Thêm guardrail cho thao tác hủy đơn, cảnh báo bất thường, kiểm thử tải và post-mortem có owner.',
                        'Gỡ bỏ tính năng hủy đơn khỏi toàn bộ hệ thống.',
                        'Chỉ viết email xin lỗi nội bộ.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Cần cơ chế phòng ngừa, phát hiện sớm và trách nhiệm cải tiến rõ ràng sau post-mortem.'
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
                    title: 'Bạn nên định nghĩa bài toán ghép cuốc xe như thế nào?',
                    helper: 'Chọn cách nêu mục tiêu và ràng buộc vận hành.',
                    options: [
                        'Chỉ tối ưu khoảng cách ngắn nhất giữa tài xế và điểm nhận.',
                        'Tối ưu tổng chi phí/thời gian rỗng trong các ràng buộc SLA, năng lực xe, vị trí và trạng thái tài xế.',
                        'Luôn ghép đơn cho tài xế gần nhất bất kể loại đơn.',
                        'Chỉ ưu tiên tài xế có điểm đánh giá cao nhất.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Bài toán matching cần mục tiêu tối ưu rõ và các ràng buộc vận hành, không chỉ khoảng cách.'
                },
                {
                    title: 'Tín hiệu nào nên dùng để xếp hạng một cặp tài xế và đơn hàng?',
                    helper: 'Chọn bộ tín hiệu cân bằng hiệu quả và trải nghiệm.',
                    options: [
                        'Khoảng cách, ETA, loại xe, tải trọng, lịch sử hủy, độ tin cậy và thời gian chờ của hai phía.',
                        'Tên tài xế theo thứ tự alphabet.',
                        'Chỉ số lượt đăng nhập trong ngày.',
                        'Màu xe của tài xế.'
                    ],
                    correctAnswer: 'A',
                    explanation: 'Các tín hiệu liên quan đến ETA, năng lực và độ tin cậy phản ánh chất lượng ghép thực tế.'
                },
                {
                    title: 'Logic ghép cuốc theo thời gian thực nên vận hành ra sao?',
                    helper: 'Chọn quy trình tạo ứng viên, tính điểm và cập nhật khi dữ liệu đổi.',
                    options: [
                        'Tính danh sách ghép mỗi ngày một lần.',
                        'Tạo candidate theo vùng/thời gian, tính score, khóa ngắn hạn và re-rank khi vị trí hoặc trạng thái thay đổi.',
                        'Để tài xế tự chọn toàn bộ đơn trong danh sách chung.',
                        'Ghép ngẫu nhiên để hệ thống đơn giản hơn.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Real-time matching cần cập nhật liên tục và có cơ chế khóa ngắn để tránh cùng một đơn bị nhận nhiều lần.'
                },
                {
                    title: 'Trường hợp biên nào hệ thống matching cần xử lý?',
                    helper: 'Chọn nhóm tình huống dễ làm thuật toán sai lệch.',
                    options: [
                        'Giờ cao điểm, hủy chuyến, mất kết nối, vùng ít tài xế, đơn quá khổ và thay đổi ETA đột ngột.',
                        'Người dùng đổi ảnh đại diện.',
                        'Tài xế đổi ngôn ngữ ứng dụng.',
                        'Tên cửa hàng quá dài trong giao diện.'
                    ],
                    correctAnswer: 'A',
                    explanation: 'Các tình huống này ảnh hưởng trực tiếp đến khả năng giao đúng hạn và độ ổn định của ghép cuốc.'
                },
                {
                    title: 'Bạn nên thử nghiệm thuật toán matching mới như thế nào?',
                    helper: 'Chọn cách đo tác động trước khi rollout rộng.',
                    options: [
                        'Rollout 100% ngay nếu mô hình chạy được trên máy dev.',
                        'Chạy offline simulation, shadow test, A/B theo khu vực và theo dõi empty miles, SLA, cancel rate, thu nhập tài xế.',
                        'Chỉ hỏi ý kiến một nhóm tài xế thân thiết.',
                        'Đo duy nhất số cuốc được tạo trong hệ thống.'
                    ],
                    correctAnswer: 'B',
                    explanation: 'Kết hợp mô phỏng, shadow test và A/B giúp đo cả hiệu quả kinh doanh lẫn rủi ro vận hành.'
                }
            ]
        }
    });
})();
