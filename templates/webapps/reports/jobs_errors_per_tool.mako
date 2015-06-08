<%inherit file="/base.mako"/>
<%namespace file="/message.mako" import="render_msg" />

%if message:
    ${render_msg( message, 'done' )}
%endif

<div class="toolForm">
    <div class="toolFormBody">
        <h4 align="center">Jobs In Error Per Month</h4>
        <h5 align="center">Click Month to view details.</h5>
        <table align="center" width="60%" class="colored">
            %if len( jobs ) == 0:
                <tr><td colspan="2">There are no jobs in the error state.</td></tr>
            %else:
                <tr class="header">
                    <td>Tool ID</td>
                    %if is_user_jobs_only:
    					<td>User Jobs in Error</td>
					%else:
	                    <td>User + Monitor Jobs in Error</td>
	                %endif
                </tr>
                <% ctr = 0 %>
                %for job in jobs:
                    %if ctr % 2 == 1:
                        <tr class="odd_row">
                    %else:
                        <tr class="tr">
                    %endif
                        <td>${job[1]}</td>
                        <td>${job[0]}</td>
                    </tr>
                    <% ctr += 1 %>
                %endfor
            %endif
        </table>
    </div>
</div>
