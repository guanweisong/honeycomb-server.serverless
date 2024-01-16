import { Link, Text } from '@react-email/components';
import * as React from 'react';
import { Comment, Setting } from '.prisma/client';
import EmailContainer from '@/app/components/EmailMessage/Components/Container';
import { getPostOrPageOrCustomTitleAndLinkFromComment } from '@/libs/getPostOrPageOrCustomTitleAndLinkFromComment';

type AdminMessageEmailProps = {
  currentComment: Comment;
  setting: Setting;
};

const AdminCommentEmailMessage = (props: AdminMessageEmailProps) => {
  const { currentComment, setting } = props;
  const previewText = `${setting.siteName?.zh}有一条新的评论`;
  const { postTitle, postLink } = getPostOrPageOrCustomTitleAndLinkFromComment(currentComment);

  return (
    <EmailContainer
      setting={setting}
      previewText={previewText}
      header={<Text>管理员，您好</Text>}
      children={
        <>
          <Text>
            {currentComment.author}在[{setting.siteName?.zh}]的文章[{postTitle}]上发表了新的评论:
          </Text>
          <Text className="border-2 border-dashed border-gray-300 bg-gray-100 p-2 whitespace-pre-wrap">
            {currentComment.content}
          </Text>
        </>
      }
      footer={
        <Text>
          您可以点击 <Link href={postLink}>查看完整的回复内容</Link>
        </Text>
      }
    />
  );
};

export default AdminCommentEmailMessage;
