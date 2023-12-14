import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

type MessageUsEmailProps = {
  author: string;
  message: string;
};

const CommentEmailMessage = ({ author, message }: MessageUsEmailProps) => {
  const previewText = `稻草人博客有一条来自 ${author} 发布的评论：${message}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="my-[20px] mx-auto p-[20px] max-w-4xl">
            <Heading className="text-black text-[20px] font-normal text-left">
              <strong>您好,</strong>
            </Heading>
            <Text className="text-[#666666] text-[12px]">{previewText}✨</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CommentEmailMessage;
