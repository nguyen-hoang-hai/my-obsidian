---
title: Generator Synchronization
---
- Live Bus Synchronization :
	- Tất cả máy phát khởi động đồng thời. Khi đạt tốc độ và điện áp định mức thì hệ thống "Arbitration" sẽ cho phép một máy phát đóng breaker đầu tiên vào thanh cái hệ thống. Sau khi thanh cái đã được cấp điện thì các máy phát còn lại thực hiện synchronizing (điện áp, tần số và góc pha) rồi lần lượt đóng breaker kết nối vào thanh cái. 
	- Máy phát đầu tiên đóng vào thanh cái không được xác định trước mà phụ thuộc vào máy nào đạt điều kiện sẵn sàng trước.
- Dead Bus Synchronization :
	- Tất cả máy phát khởi động đồng thời, các breaker của máy phát cũng được đóng vào thanh cái đang mất điện trước khi các máy phát phát điện áp. Sau khi toàn bộ máy phát đạt tốc độ yêu cầu, hệ thống kích từ đồng thời tạo điện áp trên toàn bộ thanh cái. Khi này thanh cái đã được thiết lập điện áp và tần số định mức rồi mới bắt đầu đóng breaker kết nối vào hệ thống để cấp điện cho tải.
	- Phương pháp này có thể đưa thanh cái lên điện áp nhanh và thuận lợi khi cấp điện cho hệ thống có nhiều máy biến áp lớn.
- Về điểm khác nhau thấy rõ cho 2 phương thức này :
	- Đối với Live Bus Synch thì nếu 1 máy phát có sự cố thì các máy phát các vẫn chạy và hệ thống vẫn hoạt động bình thường.
	- Đối với Dead Bus Synch thì nếu 1 máy phát có sự cố thì có thể ảnh hưởng tới toàn bộ quá trình và ảnh hưởng trực tiếp tới hệ thống. 
---
![[The Deference Between Dead Bus and Live Bus Synchronization Powered.mp4]]
