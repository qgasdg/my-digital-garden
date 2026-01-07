import { Metadata } from 'next';
// import { FireflyBackground } from '@/components/firefly-background';

export const metadata: Metadata = {
  title: 'About',
  description: '이 디지털 가든에 대하여',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* <FireflyBackground /> */}

      <div className="relative z-10">
        <main className="container mx-auto px-4 py-16 max-w-5xl">
          <article className="prose prose-lg dark:prose-invert mx-auto">
            <h1 className="!text-4xl !font-bold !font-serif !mb-8">About</h1>

            <div className="space-y-6">
              <p>
                이곳은 생각과 아이디어가 자라나는 디지털 정원입니다.
              </p>

              <p>
                관심 있는 주제에 대한 노트, 에세이, 생각들을 모아두는 공간입니다.
                완성된 글만 올리는 전통적인 블로그와 달리, 이 정원은 배우고 생각하는 과정 자체를 담습니다.
              </p>

              <h2 className="!text-2xl !font-semibold !font-serif !mt-12 !mb-4">디지털 가든이란?</h2>

              <p>
                디지털 가든은 온라인 콘텐츠에 대한 새로운 접근 방식입니다.
                시간순으로 정렬된 완성된 글을 보여주는 대신, 정원은:
              </p>

              <ul>
                <li><strong>진화합니다:</strong> 노트는 시간이 지나며 성장하고 변합니다</li>
                <li><strong>연결됩니다:</strong> 아이디어들이 자연스럽게 서로 이어집니다</li>
                <li><strong>탐험적입니다:</strong> 모든 것이 완벽하거나 완성될 필요가 없습니다</li>
                <li><strong>비시간순입니다:</strong> 콘텐츠는 주제와 연결에 따라 구성됩니다</li>
              </ul>

              <h2 className="!text-2xl !font-semibold !font-serif !mt-12 !mb-4">이 사이트에 대해</h2>

              <p>
                이 정원은 Next.js와 MDX로 만들어졌으며, 전통적인 인쇄 매체에서 영감을 받은 따뜻한 에디토리얼 디자인을 사용합니다.
              </p>

              <p>
                자유롭게 둘러보고, 탐험하고, 아이디어가 자라나는 것을 지켜봐 주세요.
              </p>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
