
        
export type EnrollmentStatus = 'pending' | 'confirmed' | 'canceled';

export interface EnrollmentModel {
  id: string; // 报名编号
  activityId: string;
  activityTitle: string;
  userName: string;
  userPhone: string;
  idCard?: string;
  participantCount: number;
  remark?: string;
  status: EnrollmentStatus;
  submitTime: string;
}

export const MOCK_ENROLLMENTS: EnrollmentModel[] = [
  {
    id: 'BM-20260312-001',
    activityId: 'act-001',
    activityTitle: '青岛崂山“守护夕阳”老年人陪伴活动',
    userName: '张三',
    userPhone: '13511112222',
    idCard: '37021119900101****',
    participantCount: 1,
    status: 'confirmed',
    submitTime: '2026-03-12 10:30:00'
  },
  {
    id: 'BM-20260312-002',
    activityId: 'act-001',
    activityTitle: '青岛崂山“守护夕阳”老年人陪伴活动',
    userName: '李小美',
    userPhone: '18677778888',
    participantCount: 2,
    status: 'pending',
    submitTime: '2026-03-12 11:15:00'
  }
];
        
      