import React, { useRef, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import Message from "@/components/Message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useCreateMessage } from "../api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const formatDateLabel = (dataStr: string) => {
  const date = new Date(dataStr);
  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "EEEE, MMMM d");
};

const TIME_THRESHOLD = 5;

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    setIsPending(true);
    editorRef?.current?.enable(false);

    const values: CreateMessageValues = {
      channelId,
      workspaceId,
      parentMessageId: messageId,
      body,
      image: undefined,
    };

    if (image) {
      const url = await generateUploadUrl({});
      // const url = await generateUploadUrl({}, { throwError: true })

      if (!url) {
        throw new Error("Url not found");
      }

      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();

      values.image = storageId;
    }
    try {
      setIsPending(true);
      await createMessage(values);
      // await createMessage(values, { throwError: true });
      toast.success("Message Sent");
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to Send message");
    } finally {
      setIsPending(false);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, message: any) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, (typeof results)[0][]>
  );

  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between px-4 h-[49px] items-center border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between px-4 h-[49px] items-center border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm">Message not Found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p>Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(
          ([dateKey, messages]: any) => (
            <div key={dateKey}>
              <div>
                <div />
                <span>{formatDateLabel(dateKey)}</span>
              </div>
              {messages.map((message: any, index: any) => {
                const prevMessage = messages[index - 1];
                const isCompact =
                  prevMessage &&
                  prevMessage.user?._id === message.user?._id &&
                  differenceInMinutes(
                    new Date(message._creationTime),
                    new Date(prevMessage._creationTime)
                  ) < TIME_THRESHOLD;

                return (
                  <Message
                    key={message._id}
                    id={message._id}
                    memberId={message.memberId}
                    authorImage={message.user?.image}
                    authorName={message.user.name}
                    isAuthor={message.memberId === currentMember?._id}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.image}
                    updatedAt={message.updatedAt}
                    createdAt={message._creationTime}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                    isCompact={isCompact}
                    hideThreadButton
                    threadCount={message.threadCount}
                    threadImage={message.threadImage}
                    threadName={message.threadName}
                    threadTimestamp={message.threadTimestamp}
                  />
                );
              })}
            </div>
          )
        )}
        <div
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div>
            <div />
            <span>
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          // isCompact={isCompact}
          // threadCount={message.threadCount}
          // threadImage={message.threadImage}
          // threadTimestamp={message.threadTimestamp}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          innerRef={editorRef}
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};
