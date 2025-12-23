import CDialog from "@/components/ui/CDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiMail, FiUsers } from "react-icons/fi";
import { useCreateShare } from "@/hooks/tanstack/share-tanstack";
import { toast } from "sonner";
import { BiSolidCopy } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";

const ShareForm = ({ trigger, folderId, file }) => {
  const dialogCloseRef = useRef();
  const [emails, setEmails] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [anyone, setAnyone] = useState(false);

  const { mutate, isPending, isError, error } = useCreateShare();

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleAddEmail = () => {
    const email = inputEmail.trim();
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails((prev) => [...prev, email]);
      setInputEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async () => {
    if (!anyone && emails.length === 0) {
      return false;
    }
    let data = anyone ? { isForAll: true } : { emails };

    if (!data) {
      return;
    }

    mutate(
      { folderId, fileId: file?._id, data },
      {
        onSuccess: (data) => {
          if (dialogCloseRef.current) dialogCloseRef.current();
          toast(
            <div className="flex items-center justify-between gap-3 w-full">
              <div className="flex flex-col items-start">
                <span className="text-sm">
                  Share Link{" "}
                  <span className="text-xs text-zinc-500">
                    all your share file in Shared File Tab
                  </span>
                </span>

                <span className="text-xs line-clamp-1 break-all">
                  {data?.link}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(data?.link);
                  toast.success("Link Copied !", {
                    position: "top-center",
                  });
                }}
              >
                <BiSolidCopy />
              </Button>
            </div>,
            {
              duration: 5000,
              position: "top-center",
              style: {
                borderRadius: "10px",
                padding: "10px 14px",
                background: "white",
                color: "black",
                maxWidth: "400px",
                width: "auto",
              },
            }
          );
        },
      }
    );
  };

  return (
    <CDialog
      trigger={trigger}
      title="Share File"
      description={`Share your file - ${file?.fileName} with other people.`}
      onSuccess={handleSubmit}
      btnSuccessChildren="Create Link"
      isLoading={isPending}
      dialogCloseRef={dialogCloseRef}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={anyone}
            onCheckedChange={(value) => setAnyone(value)}
            className="cursor-pointer mt-1 size-5"
          />
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <FiUsers />
              Anyone with this link
            </div>
            <p className="text-xs text-zinc-500 ">
              Anyone who has the link will be able to view this file — no
              sign-in required.
            </p>
          </div>
        </div>
        {!anyone && (
          <div className="">
            <div className="m-0.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
              >
                Share with specific people by Email
              </label>
              <p className="text-xs text-zinc-500">
                Only the specified people will be able to access this file —
                they must sign in with the email you provide.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                id="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                type="email"
                className="placeholder:text-zinc-500"
                placeholder="type email . . . ."
              />
              <Button
                size="icon"
                type="button"
                disabled={
                  !isValidEmail(inputEmail.trim()) ||
                  emails.includes(inputEmail.trim())
                }
                onClick={handleAddEmail}
              >
                <IoMdAdd />
              </Button>
            </div>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {emails.map((email) => (
                  <Button
                    key={email}
                    title="remove email"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <FiMail />{" "}
                    <span className="line-clamp-1 max-w-41 truncate">
                      {email}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
        {isError && error?.message && (
          <div className="px-3 py-1 text-sm text-red-500 break-words">
            {error.message}
          </div>
        )}
      </div>
    </CDialog>
  );
};

export default ShareForm;
