
export interface HeroBanner {
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export const HOME_HERO_DATA: HeroBanner = {
  title: "微光成炬，点亮非凡",
  subtitle: "加入青岛微光慈善基金会，让温情传递到城市的每一个角落",
  imageUrl: "https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/3/13/a5cb0ecd-fbc3-4b01-b4eb-e4013f9b8c0f.png",
  link: "./home.html"
};

export const QUICK_FILTERS = [
  { label: '全部日期', value: 'all' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
];
      