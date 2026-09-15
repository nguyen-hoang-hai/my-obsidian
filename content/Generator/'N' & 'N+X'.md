---
title: "'N' & 'N+X' Redundancy"
---
## 'N' - Base requirement
- Hệ thống thường được sử dụng và số lượng máy biến áp, máy phát hoặc UPS được tính toán phù hợp với hệ thống mà không cần dự phòng thêm. 
- Trường hợp ở đây thường là 1 máy biến áp và 1 máy phát hoặc là 1 UPS.

>System meets base requirements and has no redundancy [^1].
## 'N+1' Redundancy
- Hệ thống dự phòng thêm 1 thiết bị hoặc hệ thống ngoài số lượng máy biến áp, máy phát hoặc UPS tối thiểu cần thiết để đáp ứng cho hệ thống.
- Trường hợp ở đây như :
	- Hệ thống cần 3 UPS → lắp đặt 4 UPS (3 hoạt động + 1 dự phòng).
	- Hệ thống cần 1 máy phát → lắp đặt 2 máy phát (1 hoạt động + 1 dự phòng).

>N+1 redundancy provides one additional unit, module, path, or system in addition to the minimum required to satisfy the base requirement. The failure or maintenance of any single unit, module, or path will not disrupt operations [^1].
## 'N+2' Redundancy
 - Hệ thống dự phòng thêm 2 thiết bị hoặc hệ thống ngoài số lượng máy biến áp, máy phát hoặc UPS tối thiểu cần thiết để đáp ứng cho hệ thống.
- Trường hợp ở đây như :
	- Hệ thống cần 3 UPS → lắp đặt 5 UPS (3 hoạt động + 2 dự phòng).
	- Hệ thống cần 1 máy phát → lắp đặt 3 máy phát (1 hoạt động + 2 dự phòng).

>N+2 redundancy provides two additional units, modules, paths, or systems in addition to the minimum required to satisfy the base requirement. The failure or maintenance of any two single units, modules, or paths will not disrupt operations [^1].
## '2N' Redundancy
- Hệ thống dự phòng 2N cung cấp hai bộ hệ thống cấp nguồn hoàn chỉnh và độc lập, mỗi bộ đều có khả năng đáp ứng được 100% tải yêu cầu.
- Trường hợp ở đây như hệ thống đang cần 2 máy biến áp + 4 máy phát thì cấu hình 2N yêu cầu lắp đặt 4 máy biến áp + 8 máy phát (được chia thành 2 bộ 2 máy biến áp + 4 máy phát).

>2N redundancy provides two complete units, modules, paths, or systems for every one required for a base system. ”Failure or maintenance of one entire unit, module, path, or system will not disrupt operations [^1].
## '2N+1' Redundancy
- Hệ thống này cung cấp 2 hệ thống N+1 hoàn hình và độc lập.
- Trường hợp ở đây như hệ thống đang cần 2 máy biến áp + 4 máy phát thì cấu hình 2N+1 yêu cầu lắp đặt 4 máy biến áp + 10 máy phát (được chia thành 2 bộ 2 máy biến áp + 4 máy phát hoạt động + 1 máy phát dự phòng).

>2(N+1) redundancy provides two complete (N+1) units, modules, paths, or systems. Even in the event of failure or maintenance of one unit, module, path, or system, some redundancy will be provided and operations will not be disrupted [^1].

[^1]: Tiêu chuẩn ANSI/TIA-942.